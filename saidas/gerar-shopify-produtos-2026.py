import os
import zipfile
import csv
import re
import shutil
from pathlib import Path

BASE_DIR = Path(r"C:\Users\seven\Downloads\PRODUTOS 2026")
OUTPUT_DIR = Path(r"C:\Users\seven\MazyOS\saidas\shopify-produtos-2026")
IMAGES_DIR = OUTPUT_DIR / "imagens"

PRICES = {
    "Fan": "179.90",
    "Infantil": "189.90",
    "Player": "219.90",
    "Retro": "219.90",
    "NBA": "239.90",
    "Treino": "169.90",
    "Corta-Vento": "249.90",
}

FOLDER_MAP = {
    "BRASILEIRO":     {"collection": "Brasileiro",    "type": "Fan",         "price": PRICES["Fan"],         "tags_extra": ["Futebol", "Brasileiro"]},
    "EUROPA":         {"collection": "Europa",         "type": "Fan",         "price": PRICES["Fan"],         "tags_extra": ["Futebol", "Europa"]},
    "SELEÇÕES":       {"collection": "Seleções",       "type": "Fan",         "price": PRICES["Fan"],         "tags_extra": ["Futebol", "Seleção"]},
    "SUL AMERICANOS": {"collection": "Sul Americanos", "type": "Fan",         "price": PRICES["Fan"],         "tags_extra": ["Futebol", "Sul Americanos"]},
    "NBA":            {"collection": "NBA",            "type": "NBA",         "price": PRICES["NBA"],         "tags_extra": ["Basquete", "NBA"]},
    "RÊTRO":          {"collection": "Retrô",          "type": "Retrô",       "price": PRICES["Retro"],       "tags_extra": ["Futebol", "Retrô"]},
    "KIT INFANTIL":   {"collection": "Kit Infantil",   "type": "Infantil",    "price": PRICES["Infantil"],    "tags_extra": ["Futebol", "Infantil", "Kids"]},
    "TREINO":         {"collection": "Treino",         "type": "Treino",      "price": PRICES["Treino"],      "tags_extra": ["Futebol", "Treino"]},
    "CORTA - VENTO":  {"collection": "Corta-Vento",   "type": "Corta-Vento", "price": PRICES["Corta-Vento"], "tags_extra": ["Futebol", "Corta-Vento"]},
}

SIZES = ["P", "M", "G", "GG", "XG"]

CHAR_MAP = {
    "á": "a", "à": "a", "ã": "a", "â": "a", "ä": "a",
    "é": "e", "è": "e", "ê": "e", "ë": "e",
    "í": "i", "ì": "i", "î": "i", "ï": "i",
    "ó": "o", "ò": "o", "õ": "o", "ô": "o", "ö": "o",
    "ú": "u", "ù": "u", "û": "u", "ü": "u",
    "ç": "c", "ñ": "n",
    "Á": "a", "À": "a", "Ã": "a", "Â": "a",
    "É": "e", "È": "e", "Ê": "e",
    "Í": "i", "Ì": "i", "Î": "i",
    "Ó": "o", "Ò": "o", "Õ": "o", "Ô": "o",
    "Ú": "u", "Ù": "u", "Û": "u",
    "Ç": "c", "Ñ": "n",
}

def remove_accents(text):
    result = ""
    for c in text:
        result += CHAR_MAP.get(c, c)
    return result

def make_handle(title):
    h = remove_accents(title.lower())
    h = re.sub(r"[^a-z0-9\s\-]", "", h)
    h = re.sub(r"\s+", "-", h.strip())
    h = re.sub(r"-+", "-", h)
    return h.strip("-")

def clean_name(filename, folder_name):
    name = filename.replace(".zip", "")
    name = re.sub(r"-3-001\s*(\(\d+\))?$", "", name)
    name = re.sub(r"\s*\(\d+\)$", "", name)
    name = re.sub(r"^\[.*?\]\s*", "", name)
    name = name.strip().rstrip(".-").strip()
    name = re.sub(r"\s+", " ", name)
    return name.strip()

def title_case_smart(text):
    minor = {"de", "da", "do", "das", "dos", "e", "of", "the", "a", "an"}
    words = text.lower().split()
    result = []
    for i, w in enumerate(words):
        if i == 0 or w not in minor:
            result.append(w.capitalize())
        else:
            result.append(w)
    return " ".join(result)

def detect_type_price(product_name, folder_cfg):
    n = product_name.upper()
    if "RETRÔ" in n or "RETRO" in n:
        return "Retrô", PRICES["Retro"]
    if "PLAYER" in n:
        return "Player", PRICES["Player"]
    if "INFANTIL" in n or "KIDS" in n or folder_cfg["type"] == "Infantil":
        return "Infantil", PRICES["Infantil"]
    if "TREINO" in n or "VIAGEM" in n or folder_cfg["type"] == "Treino":
        return "Treino", PRICES["Treino"]
    if "CORTA" in n or folder_cfg["type"] == "Corta-Vento":
        return "Corta-Vento", PRICES["Corta-Vento"]
    if folder_cfg["type"] == "NBA":
        return "NBA", PRICES["NBA"]
    return folder_cfg["type"], folder_cfg["price"]

def extract_first_jpg(zip_path, dest_folder):
    dest_folder.mkdir(parents=True, exist_ok=True)
    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            entries = zf.namelist()
            images = [e for e in entries if e.lower().endswith((".jpg", ".jpeg", ".png"))]
            if not images:
                return None
            jpg = [e for e in images if e.lower().endswith((".jpg", ".jpeg"))]
            sized = [(zf.getinfo(e).file_size, e) for e in (jpg if jpg else images)]
            sized.sort()
            chosen_name = sized[0][1]
            ext = Path(chosen_name).suffix.lower() or ".jpg"
            dest_file = dest_folder / f"imagem-principal{ext}"
            data = zf.read(chosen_name)
            dest_file.write_bytes(data)
            return dest_file
    except Exception as ex:
        print(f"  [ERRO] {zip_path.name}: {ex}")
        return None

def make_description(product_name, ptype, collection):
    return (
        f"<p>Camisa {product_name} — modelo {ptype}. "
        f"Coleção {collection}. Tecido de alta qualidade com tecnologia dry-fit. "
        f"Disponível nos tamanhos P, M, G, GG e XG.</p>"
    )

def build_tags(product_name, ptype, collection, extra_tags):
    tags = set(extra_tags)
    tags.add(ptype)
    tags.add(collection)
    name_upper = product_name.upper()
    for kw in ["HOME", "AWAY", "THIRD", "I", "II", "III"]:
        if re.search(r'\b' + kw + r'\b', name_upper):
            tags.add(kw.title())
    return ", ".join(sorted(tags))

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    products_rows = []
    collections_rows = []
    redirects_rows = []
    collections_seen = set()

    handle_count = {}
    skipped = []

    print(f"Processando ZIPs em: {BASE_DIR}")
    print("=" * 60)

    for folder_name, folder_cfg in FOLDER_MAP.items():
        folder_path = BASE_DIR / folder_name
        if not folder_path.exists():
            print(f"[AVISO] Pasta não encontrada: {folder_name}")
            continue

        zip_files = sorted(folder_path.glob("*.zip"))
        print(f"\n{folder_name}: {len(zip_files)} ZIPs")

        collection_name = folder_cfg["collection"]
        if collection_name not in collections_seen:
            collections_seen.add(collection_name)
            collections_rows.append({
                "Handle": make_handle(collection_name),
                "Title": collection_name,
                "Body HTML": f"<p>Coleção {collection_name} — Boleiro Store.</p>",
                "Published": "TRUE",
            })

        for zip_file in zip_files:
            raw_name = clean_name(zip_file.name, folder_name)
            product_name = title_case_smart(raw_name)
            ptype, price = detect_type_price(raw_name, folder_cfg)

            base_handle = make_handle(product_name)
            if not base_handle:
                skipped.append(zip_file.name)
                continue

            if base_handle in handle_count:
                handle_count[base_handle] += 1
                handle = f"{base_handle}-{handle_count[base_handle]}"
            else:
                handle_count[base_handle] = 1
                handle = base_handle

            tags = build_tags(product_name, ptype, collection_name, folder_cfg["tags_extra"])
            description = make_description(product_name, ptype, collection_name)

            img_folder = IMAGES_DIR / folder_name / base_handle
            img_file = extract_first_jpg(zip_file, img_folder)
            img_src = str(img_file) if img_file else ""

            first_row = True
            for size in SIZES:
                row = {
                    "Handle": handle,
                    "Title": product_name if first_row else "",
                    "Body (HTML)": description if first_row else "",
                    "Vendor": "Boleiro Store" if first_row else "",
                    "Product Category": "Sporting Goods" if first_row else "",
                    "Type": ptype if first_row else "",
                    "Tags": tags if first_row else "",
                    "Published": "TRUE" if first_row else "",
                    "Option1 Name": "Tamanho",
                    "Option1 Value": size,
                    "Variant SKU": f"{handle}-{size}",
                    "Variant Price": price,
                    "Variant Inventory Qty": "100",
                    "Variant Inventory Policy": "deny",
                    "Variant Fulfillment Service": "manual",
                    "Variant Requires Shipping": "TRUE",
                    "Status": "active" if first_row else "",
                    "Image Src": img_src if first_row else "",
                    "Image Position": "1" if first_row else "",
                    "Image Alt Text": product_name if first_row else "",
                }
                products_rows.append(row)
                first_row = False

            redirects_rows.append({
                "Redirect from": f"/{make_handle(raw_name)}",
                "Redirect to": f"/products/{handle}",
            })

            print(f"  OK: {product_name} [{ptype}] R${price}")

    products_fields = [
        "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags",
        "Published", "Option1 Name", "Option1 Value", "Variant SKU", "Variant Price",
        "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
        "Variant Requires Shipping", "Status", "Image Src", "Image Position", "Image Alt Text",
    ]

    products_path = OUTPUT_DIR / "products.csv"
    with open(products_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=products_fields)
        w.writeheader()
        w.writerows(products_rows)

    collections_fields = ["Handle", "Title", "Body HTML", "Published"]
    collections_path = OUTPUT_DIR / "collections.csv"
    with open(collections_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=collections_fields)
        w.writeheader()
        w.writerows(collections_rows)

    redirects_fields = ["Redirect from", "Redirect to"]
    redirects_path = OUTPUT_DIR / "redirects.csv"
    with open(redirects_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=redirects_fields)
        w.writeheader()
        w.writerows(redirects_rows)

    print("\n" + "=" * 60)
    print(f"CONCLUIDO!")
    print(f"  Produtos:   {len(handle_count)} produtos ({len(products_rows)} linhas)")
    print(f"  Colecoes:   {len(collections_rows)}")
    print(f"  Redirects:  {len(redirects_rows)}")
    if skipped:
        print(f"  Ignorados:  {skipped}")
    print(f"\nArquivos gerados em: {OUTPUT_DIR}")
    print(f"  -> {products_path}")
    print(f"  -> {collections_path}")
    print(f"  -> {redirects_path}")
    print(f"  -> {IMAGES_DIR} (imagens principais extraidas)")

if __name__ == "__main__":
    main()
