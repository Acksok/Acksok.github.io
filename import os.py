import os
import json

def generar_json_galeria(carpeta_origen, archivo_json):
    # Definir las extensiones de imagen que queremos incluir
    extensiones_validas = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}
    
    # Obtener la lista de archivos en la carpeta de origen
    archivos = os.listdir(carpeta_origen)
    
    # Filtrar solo archivos que tengan extensiones válidas
    imagenes = [
        archivo for archivo in archivos 
        if os.path.isfile(os.path.join(carpeta_origen, archivo)) and os.path.splitext(archivo)[1].lower() in extensiones_validas
    ]
    
    # Ordenar la lista (opcional)
    imagenes.sort()

    # Escribir la lista de imágenes en el archivo JSON
    with open(archivo_json, "w", encoding="utf-8") as f:
        json.dump(imagenes, f, indent=4, ensure_ascii=False)
    
    print(f"Se han encontrado {len(imagenes)} imágenes. JSON generado en: {archivo_json}")

if __name__ == '__main__':
    # Ruta absoluta o relativa a la carpeta que contiene tus imágenes.
    # Ejemplo: si la carpeta se encuentra en "C:\Users\Alexi\IdeaProjects\Acksok.github.io\Galeria"
    ruta_galeria = r"C:\Users\Alexi\IdeaProjects\Acksok.github.io\Galeria"
    # Archivo JSON de salida, que luego deberás ubicar en la raíz de tu proyecto web.
    salida_json = "galeria.json"
    
    generar_json_galeria(ruta_galeria, salida_json)
