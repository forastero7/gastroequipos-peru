# Libro de reclamaciones — Puesta en marcha (15 min)

Todo corre gratis con la cuenta de Google de **jeinox2020@gmail.com**.

## 1. Crear la hoja y el script
1. Entra a Google Sheets con jeinox2020@gmail.com y crea una hoja nueva llamada **"Libro de reclamaciones Jeinox"**.
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs` y pega todo `Code.gs`.
4. En ⚙️ **Configuración del proyecto**, marca "Mostrar el archivo de manifiesto appsscript.json" y reemplaza su contenido con `appsscript.json`.
5. Guarda (Ctrl + S).

## 2. Configuración inicial
1. Arriba, en el selector de funciones, elige **configurarTodo** y pulsa **Ejecutar**.
2. Acepta los permisos (Google avisará "app no verificada": *Configuración avanzada → Ir al proyecto*). Es normal, el script es tuyo.
3. Vuelve a la hoja y recárgala: aparecerá el menú **Libro de reclamaciones** y la pestaña "Reclamaciones" con encabezados.

## 3. Publicar como Web App
1. En Apps Script: **Implementar → Nueva implementación → Tipo: Aplicación web**.
2. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
3. Copia la URL que termina en `/exec`.

## 4. Conectar la web
1. Abre `js/reclamaciones.js` y pega la URL en `const ENDPOINT = "..."`.
2. Sube los cambios al repositorio y despliega en Netlify.

## 5. Probar
Envía un reclamo de prueba con tu propio correo. Debes ver: código en pantalla, fila nueva en la hoja, correo de copia al cliente y aviso en jeinox2020@gmail.com. Luego borra la fila de prueba.
> El correlativo no se reinicia al borrar filas (es correcto: los códigos no deben repetirse).

## Cómo responder un reclamo
1. Escribe la respuesta en la columna **Respuesta** de la fila.
2. Con la fila seleccionada: **Libro de reclamaciones → Enviar respuesta de la fila seleccionada**.
3. El cliente recibe el correo (con copia a Jeinox), y la fila pasa a **Respondido** con la fecha.

Cada día a las 8:00 a. m. llega un correo si hay reclamos a 3 días hábiles o menos de vencer.

## Notas
- **Plazo legal:** 15 días hábiles. El script descuenta fines de semana y feriados de la lista `FERIADOS`; actualízala cada año.
- **Si editas Code.gs después:** Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva. Así la URL no cambia.
- **Límite de correos:** una cuenta Gmail gratuita envía unos 100 correos al día, de sobra para este uso.
- **Conservación:** no borres filas reales. La norma exige conservar las hojas de reclamación al menos 2 años.
- Evidencias: se guardan en Drive, carpeta "Libro de Reclamaciones - Evidencias".
