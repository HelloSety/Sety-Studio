param([switch]$Teste)

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Drawing

$zipOrigen = "C:\Users\seven\Downloads\PRODUTOS 2026.zip"
$tmpDir    = "C:\Users\seven\MazyOS\_tmp_zips"
$imgDir    = "C:\Users\seven\MazyOS\imagens"
$csvSaida  = "C:\Users\seven\MazyOS\saidas\imagens-manto-dos-craques.csv"
$logSaida  = "C:\Users\seven\MazyOS\saidas\extrator-log.txt"
$maxDim    = 1000
$qualidade = 85
$workers   = 6

function Log {
    param($msg)
    $linha = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
    Write-Host $linha
    Add-Content -Path $logSaida -Value $linha -Encoding UTF8
}

Set-Content -Path $logSaida -Value "" -Encoding UTF8
Log "Iniciando: $zipOrigen"

New-Item -ItemType Directory -Force $tmpDir | Out-Null
New-Item -ItemType Directory -Force $imgDir | Out-Null

# --- FASE 1: extrair zips internos -------------------------------------------
Log "FASE 1: extraindo inner zips para $tmpDir"

$outerZip   = [System.IO.Compression.ZipFile]::OpenRead($zipOrigen)
$allEntries = @($outerZip.Entries | Where-Object { $_.Name -like "*.zip" })
if ($Teste) { $allEntries = $allEntries[0..2] }

$total = $allEntries.Count
Log "  Clubes encontrados: $total"

for ($i = 0; $i -lt $total; $i++) {
    $entry = $allEntries[$i]
    $dest  = Join-Path $tmpDir $entry.Name
    if (-not (Test-Path $dest)) {
        try {
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $dest, $true)
        } catch {
            Log "  ERRO: $($entry.Name) - $_"
        }
    }
    if (($i + 1) % 15 -eq 0 -or ($i + 1) -eq $total) {
        Log "  Extraidos: $($i+1) / $total"
    }
}
$outerZip.Dispose()
Log "FASE 1 concluida"

# --- FASE 2: processar imagens em paralelo -----------------------------------
Log "FASE 2: processando imagens ($workers workers)"

$blocoParalelo = {
    param($zipPath, $imgBase, $qual, $maxD)

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    Add-Type -AssemblyName System.Drawing

    $nomeRaw  = [System.IO.Path]::GetFileNameWithoutExtension($zipPath)
    $clube    = ($nomeRaw -replace '\s*\(\d+\)\s*$', '' -split '-3-')[0].Trim()
    $clubeDir = Join-Path $imgBase $clube
    New-Item -ItemType Directory -Force $clubeDir | Out-Null

    $codec  = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
              Where-Object { $_.MimeType -eq 'image/jpeg' }
    $enc    = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [long]$qual)

    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
        foreach ($entry in $zip.Entries) {
            if ($entry.Name -notmatch '\.(jpg|jpeg|png)$') { continue }

            $base    = [System.IO.Path]::GetFileNameWithoutExtension($entry.Name)
            $outFile = $base + '.jpg'
            $outPath = Join-Path $clubeDir $outFile
            $c = 1
            while (Test-Path $outPath) {
                $outFile = "${base}_${c}.jpg"
                $outPath = Join-Path $clubeDir $outFile
                $c++
            }

            $origKB = [math]::Round($entry.Length / 1KB, 1)

            try {
                $mem = New-Object System.IO.MemoryStream
                $s   = $entry.Open()
                $s.CopyTo($mem)
                $s.Dispose()
                $mem.Position = 0

                $img = [System.Drawing.Image]::FromStream($mem)
                $mem.Dispose()

                if ($img.Width -gt $maxD -or $img.Height -gt $maxD) {
                    $r   = [Math]::Min($maxD / $img.Width, $maxD / $img.Height)
                    $nW  = [int]($img.Width * $r)
                    $nH  = [int]($img.Height * $r)
                    $bmp = New-Object System.Drawing.Bitmap($nW, $nH)
                    $g   = [System.Drawing.Graphics]::FromImage($bmp)
                    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                    $g.DrawImage($img, 0, 0, $nW, $nH)
                    $g.Dispose()
                    $img.Dispose()
                    $img = $bmp
                }

                $img.Save($outPath, $codec, $enc)
                $img.Dispose()

                $compKB = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
                "$clube,$outFile,imagens\$clube\$outFile,$origKB,$compKB"
            } catch {
                "$clube,$($entry.Name),ERRO,0,0"
            }
        }
        $zip.Dispose()
    } catch {
        "$clube,_ERRO_ZIP_,$_,0,0"
    }
}

$pool = [System.Management.Automation.Runspaces.RunspaceFactory]::CreateRunspacePool(1, $workers)
$pool.Open()

$jobs    = [System.Collections.Generic.List[object]]::new()
$zipArqs = @(Get-ChildItem $tmpDir -Filter '*.zip')

foreach ($zf in $zipArqs) {
    $ps = [System.Management.Automation.PowerShell]::Create()
    $ps.RunspacePool = $pool
    $ps.AddScript($blocoParalelo).AddArgument($zf.FullName).AddArgument($imgDir).AddArgument($qualidade).AddArgument($maxDim) | Out-Null
    $jobs.Add([PSCustomObject]@{ PS = $ps; Handle = $ps.BeginInvoke() })
}

Log "  $($jobs.Count) jobs disparados, aguardando..."

$csvLinhas = [System.Collections.Generic.List[string]]::new()
$csvLinhas.Add('clube,imagem,caminho_local,tamanho_original_kb,tamanho_comprimido_kb')

$done = 0
foreach ($job in $jobs) {
    $res = $job.PS.EndInvoke($job.Handle)
    foreach ($linha in $res) { if ($linha) { $csvLinhas.Add($linha) } }
    $job.PS.Dispose()
    $done++
    if ($done % 10 -eq 0 -or $done -eq $jobs.Count) {
        Log "  Concluidos: $done / $($jobs.Count)"
    }
}
$pool.Close()
Log "FASE 2 concluida - $($csvLinhas.Count - 1) imagens"

# --- FASE 3: salvar CSV ------------------------------------------------------
Log "FASE 3: salvando CSV"
$csvLinhas | Set-Content -Path $csvSaida -Encoding UTF8
Log "CSV salvo: $csvSaida"

# --- LIMPEZA -----------------------------------------------------------------
Log "Removendo temp $tmpDir"
Remove-Item $tmpDir -Recurse -Force
Log "CONCLUIDO. Imagens: $imgDir | CSV: $csvSaida"
