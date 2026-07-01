/**
 * Rodar no Google Apps Script (script.google.com):
 * Cria a planilha CRM Sety Studio com todas as abas e colunas.
 *
 * Como usar:
 * 1. Acesse script.google.com
 * 2. Crie novo projeto
 * 3. Cole este código
 * 4. Clique em Executar → criarPlanilha
 * 5. Copie o ID da planilha gerada e cole no .env (GOOGLE_SHEET_ID)
 */

function criarPlanilha() {
  const ss = SpreadsheetApp.create('CRM Sety Studio');
  const ssId = ss.getId();

  // ── Aba LEADS ─────────────────────────────────────────────────────────────
  const abaLeads = ss.getActiveSheet();
  abaLeads.setName('LEADS');

  const headerLeads = [
    'Data/Hora', 'Nome', 'Instagram', 'Cidade', 'Nicho',
    'Plataforma', 'Qtd Produtos', 'Fornecedor', 'Prazo', 'Investimento',
    'Score', 'Classificacao', 'Status CRM', 'Telefone', 'Ultimo Contato',
    'Followup 1h', 'Followup 24h', 'Followup 3d', 'Followup 7d', 'Observacoes'
  ];

  abaLeads.getRange(1, 1, 1, headerLeads.length).setValues([headerLeads]);
  abaLeads.getRange(1, 1, 1, headerLeads.length)
    .setBackground('#0a0a0a')
    .setFontColor('#ffffff')
    .setFontWeight('bold');
  abaLeads.setFrozenRows(1);
  abaLeads.setColumnWidth(1, 140);   // Data/Hora
  abaLeads.setColumnWidth(2, 150);   // Nome
  abaLeads.setColumnWidth(3, 140);   // Instagram
  abaLeads.setColumnWidth(11, 70);   // Score
  abaLeads.setColumnWidth(12, 130);  // Classificacao
  abaLeads.setColumnWidth(13, 140);  // Status CRM

  // Formatação condicional — Score
  const rangeScore = abaLeads.getRange('K2:K1000');
  const regras = [];

  // Score >= 71 → verde
  const r1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(71)
    .setBackground('#c6efce')
    .setFontColor('#276221')
    .setRanges([rangeScore])
    .build();

  // Score 41-70 → amarelo
  const r2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(41, 70)
    .setBackground('#ffeb9c')
    .setFontColor('#9c6500')
    .setRanges([rangeScore])
    .build();

  // Score < 41 → vermelho
  const r3 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(41)
    .setBackground('#ffc7ce')
    .setFontColor('#9c0006')
    .setRanges([rangeScore])
    .build();

  abaLeads.setConditionalFormatRules([r1, r2, r3]);

  // ── Aba PIPELINE ──────────────────────────────────────────────────────────
  const abaPipeline = ss.insertSheet('PIPELINE');

  const etapas = [
    ['Novos Leads', '#4285F4'],
    ['Contato Feito', '#FBBC04'],
    ['Proposta Enviada', '#FF6D00'],
    ['Negociação', '#9C27B0'],
    ['Fechado', '#34A853'],
    ['Perdido', '#EA4335']
  ];

  etapas.forEach(([nome, cor], i) => {
    const col = i + 1;
    abaPipeline.setColumnWidth(col, 160);
    abaPipeline.getRange(1, col)
      .setValue(nome)
      .setBackground(cor)
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  });

  abaPipeline.setFrozenRows(1);

  // ── Aba CONFIG ────────────────────────────────────────────────────────────
  const abaConfig = ss.insertSheet('CONFIG');
  abaConfig.getRange('A1').setValue('GOOGLE_SHEET_ID');
  abaConfig.getRange('B1').setValue(ssId);
  abaConfig.getRange('A2').setValue('Criado em');
  abaConfig.getRange('B2').setValue(new Date().toLocaleString('pt-BR'));

  // Resultado
  Logger.log('✅ Planilha criada!');
  Logger.log('ID: ' + ssId);
  Logger.log('URL: https://docs.google.com/spreadsheets/d/' + ssId);

  SpreadsheetApp.getUi().alert(
    'Planilha criada!\n\n' +
    'ID (para o .env):\n' + ssId + '\n\n' +
    'URL:\nhttps://docs.google.com/spreadsheets/d/' + ssId
  );
}
