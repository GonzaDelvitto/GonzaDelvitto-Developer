# Portafolio — Gonzalo Delvitto

Sitio estático (HTML + CSS + JS, sin frameworks ni build). Se sube directo a GitHub Pages.

## Estructura

```
index.html        → estructura del sitio (no hace falta tocarlo para cambiar textos)
css/style.css      → todos los estilos y animaciones
js/main.js         → lee data.json y arma cada sección + interacciones
data/data.json     → TODO el contenido editable: perfil, servicios, proyectos, proceso, formación, precios
img/               → poné acá las capturas de tus proyectos reales
robots.txt         → SEO técnico
sitemap.xml        → SEO técnico
```

## Qué tenés que editar vos

1. **`data/data.json`**
   - `perfil.whatsapp`: ya está con tu número (5491166784500). Si lo cambiás, va sin espacios ni "+".
   - `perfil.email`, `perfil.github`, `perfil.linkedin`: completá o dejá vacío para ocultarlo.
   - `proyectos`: reemplazá los 4 proyectos de ejemplo por los tuyos reales. El campo `img` apunta a `img/nombre-del-archivo.jpg`.
   - `formacion`: reemplazá con tus carreras y cursos reales (esto arma la línea de tiempo de la sección "Formación"). `tipo` puede ser `"carrera"` o `"curso"`, cambia el color del punto en la línea de tiempo.
   - `precios`: ajustá los planes y qué incluye cada uno.

2. **`img/`**: subí ahí las capturas de tus proyectos con esos mismos nombres de archivo (o cambiá el campo `img` en el JSON). Si falta la imagen, la tarjeta muestra automáticamente un fondo degradado en vez de romperse.

3. **`index.html`**: solo hace falta tocarlo si querés agregar/quitar una sección completa. Los textos de servicios, proyectos, proceso, formación y precios NO están acá, están en el JSON.

## SEO ya incluido

- Meta title, description, keywords, canonical.
- Open Graph y Twitter Card (actualizá `img/preview.jpg` con una imagen de 1200x630 real para que se vea bien al compartir el link).
- JSON-LD (`ProfessionalService`) para que Google entienda que sos un desarrollador ofreciendo servicios.
- `robots.txt` y `sitemap.xml`.
- HTML semántico (`header`, `main`, `section`, `footer`) y textos alternativos en imágenes.

## Cómo publicarlo

Igual que ya lo venís haciendo: subís todo el contenido de esta carpeta a la raíz del repo `gonzadelvitto.github.io/portafolio` (o al repo que uses para GitHub Pages) y hacés commit + push. No requiere build ni instalar nada.
