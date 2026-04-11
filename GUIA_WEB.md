# Guía completa del Portfolio Personal
### Carlos Larraín Lihn — Arquitecto, Robótica, Impresión 3D

> Esta guía está escrita para que cualquier persona, sin conocimientos técnicos previos, pueda entender, editar y mantener esta web. Léela de principio a fin la primera vez.

---

## Índice

1. [¿Qué es esta web y cómo funciona?](#1-qué-es-esta-web-y-cómo-funciona)
2. [Herramientas y servicios utilizados](#2-herramientas-y-servicios-utilizados)
3. [Cómo está organizada la carpeta del proyecto](#3-cómo-está-organizada-la-carpeta-del-proyecto)
4. [Requisitos previos (instalar una sola vez)](#4-requisitos-previos-instalar-una-sola-vez)
5. [Cómo abrir la terminal y navegar a la carpeta](#5-cómo-abrir-la-terminal-y-navegar-a-la-carpeta)
6. [Cómo arrancar el servidor local (ver cambios en tiempo real)](#6-cómo-arrancar-el-servidor-local-ver-cambios-en-tiempo-real)
7. [Cómo editar el contenido de la web (Sanity Studio)](#7-cómo-editar-el-contenido-de-la-web-sanity-studio)
8. [Cómo editar el diseño y el código](#8-cómo-editar-el-diseño-y-el-código)
9. [Cómo publicar cambios en la web real (deploy)](#9-cómo-publicar-cambios-en-la-web-real-deploy)
10. [Cómo actualizar el CV y el Portafolio PDF](#10-cómo-actualizar-el-cv-y-el-portafolio-pdf)
11. [Cómo funciona el formulario de contacto](#11-cómo-funciona-el-formulario-de-contacto)
12. [Variables de entorno (contraseñas y claves)](#12-variables-de-entorno-contraseñas-y-claves)
13. [Cómo ver la analítica de la web](#13-cómo-ver-la-analítica-de-la-web)
14. [Cómo volver a esta conversación con Claude para seguir editando](#14-cómo-volver-a-esta-conversación-con-claude-para-seguir-editando)
15. [Preguntas frecuentes y solución de problemas](#15-preguntas-frecuentes-y-solución-de-problemas)
16. [Resumen de cuentas y accesos](#16-resumen-de-cuentas-y-accesos)

---

## 1. ¿Qué es esta web y cómo funciona?

Esta es una web portfolio personal construida con tecnología moderna. Se compone de tres partes que trabajan juntas:

```
[Sanity Studio]  →  contenido (textos, fotos, proyectos)
      ↓
[Astro / código]  →  diseño y estructura de la web
      ↓
[Vercel]          →  publica la web en internet automáticamente
```

**El flujo normal de trabajo es:**
- Para **editar contenido** (agregar proyectos, cambiar textos, subir fotos): usas Sanity Studio, un panel visual desde el navegador.
- Para **editar el diseño** (colores, layouts, tipografía, estructura): editas los archivos de código y usas Claude Code.
- Para **publicar** todo en internet: haces `git push` y Vercel lo despliega automáticamente en segundos.

---

## 2. Herramientas y servicios utilizados

| Herramienta | Para qué sirve | Dónde se usa |
|---|---|---|
| **Astro 6** | Framework que genera las páginas de la web | En el código |
| **React 19** | Para componentes interactivos (filtros, formulario) | En el código |
| **Tailwind CSS v4** | Estilos visuales (colores, espacios, tipografía) | En el código |
| **Sanity CMS** | Panel para editar contenido sin tocar código | sanity.io |
| **Vercel** | Hosting — publica la web automáticamente | vercel.com |
| **Resend** | Servicio para enviar emails del formulario de contacto | resend.com |
| **GitHub** | Guarda el historial de cambios del código | github.com |
| **pnpm** | Gestor de paquetes (como instalar programas del proyecto) | Terminal |
| **Claude Code** | IA para editar el código de la web | claude.ai/code |

---

## 3. Cómo está organizada la carpeta del proyecto

La carpeta principal es:
```
C:\Users\clarr\Desktop\web_portafolio\portfolio-personal\
```

Dentro encontrarás esta estructura:

```
portfolio-personal/
│
├── src/                          ← Todo el código de la web
│   ├── pages/                    ← Cada archivo = una página de la web
│   │   ├── index.astro           ← Página de inicio (español)
│   │   ├── proyectos/
│   │   │   ├── index.astro       ← Galería de proyectos (español)
│   │   │   └── [slug].astro      ← Página individual de cada proyecto (español)
│   │   ├── cv.astro              ← Página CV (español)
│   │   ├── contacto.astro        ← Página de contacto (español)
│   │   ├── sobre-mi.astro        ← Página sobre mí (español)
│   │   ├── en/                   ← Versiones en inglés de todas las páginas
│   │   │   ├── index.astro
│   │   │   ├── projects/
│   │   │   ├── cv.astro
│   │   │   └── contact.astro
│   │   └── api/
│   │       └── contact.ts        ← API que procesa el formulario de contacto
│   │
│   ├── components/               ← Bloques reutilizables de la web
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro  ← Estructura base (head, header, footer)
│   │   │   ├── Header.astro      ← Menú de navegación superior
│   │   │   └── Footer.astro      ← Pie de página
│   │   ├── sections/
│   │   │   ├── Hero.astro        ← Sección hero de la página de inicio
│   │   │   ├── CVContent.astro   ← Contenido del CV
│   │   │   └── AboutContent.astro← Contenido de "Sobre mí"
│   │   └── ui/
│   │       ├── CategoryFilter.tsx← Filtros de categoría en proyectos
│   │       ├── ContactForm.tsx   ← Formulario de contacto
│   │       └── MediaGallery.tsx  ← Galería de imágenes de proyectos
│   │
│   ├── lib/
│   │   ├── sanity.ts             ← Conexión con Sanity y consultas de datos
│   │   ├── i18n.ts               ← Traducciones ES/EN y rutas por idioma
│   │   └── resend.ts             ← Configuración del envío de emails
│   │
│   └── types/
│       └── index.ts              ← Definiciones de tipos de datos
│
├── sanity/                       ← Configuración del panel de contenido
│   ├── schemas/
│   │   ├── project.ts            ← Qué campos tiene un proyecto
│   │   ├── cv.ts                 ← Qué campos tiene el CV
│   │   ├── about.ts              ← Qué campos tiene "sobre mí"
│   │   └── index.ts              ← Lista todos los schemas
│   └── sanity.config.ts          ← Configuración general de Sanity
│
├── public/                       ← Archivos estáticos (se sirven tal cual)
│   ├── cv/                       ← PDFs del CV y Portafolio
│   │   ├── CV_Carlos Larraín Lihn_ES.pdf
│   │   ├── CV_Carlos Larraín Lihn_EN.pdf
│   │   ├── Portfolio_Carlos Larraín L_ES.pdf
│   │   └── Portfolio_Carlos Larraín L_EN.pdf
│   ├── fonts/                    ← Tipografías locales
│   └── hero.mp4                  ← Video del hero de la página de inicio
│
├── astro.config.mjs              ← Configuración principal de Astro
├── package.json                  ← Lista de dependencias del proyecto
├── GUIA_WEB.md                   ← Este archivo
└── .env                          ← Claves secretas (NO subir a GitHub)
```

---

## 4. Requisitos previos (instalar una sola vez)

Estos programas deben estar instalados en el ordenador. Si ya los tienes, salta al paso 5.

### Node.js (versión 22 o superior)
Node.js es el motor que ejecuta el código de la web localmente.

1. Ve a: https://nodejs.org
2. Descarga la versión **LTS** (la recomendada)
3. Instálala con las opciones por defecto
4. Para verificar, abre la terminal y escribe: `node --version` — debería mostrar `v22.x.x`

### pnpm (gestor de paquetes)
pnpm es como un instalador de herramientas del proyecto.

1. Con Node ya instalado, en la terminal escribe:
   ```
   npm install -g pnpm
   ```
2. Para verificar: `pnpm --version`

### Git
Git es el sistema que guarda el historial de cambios del código.

1. Ve a: https://git-scm.com/downloads
2. Descarga e instala la versión para Windows
3. Para verificar: `git --version`

### Visual Studio Code (editor de código, opcional pero recomendado)
Si quieres editar código visualmente:
1. Ve a: https://code.visualstudio.com
2. Descarga e instala

---

## 5. Cómo abrir la terminal y navegar a la carpeta

### Abrir la terminal en Windows

**Opción A (más fácil):**
1. Abre el Explorador de archivos
2. Ve a la carpeta `C:\Users\clarr\Desktop\web_portafolio\portfolio-personal`
3. Haz clic en la barra de direcciones (donde pone la ruta)
4. Escribe `cmd` y presiona Enter — la terminal se abrirá directamente en esa carpeta

**Opción B:**
1. Presiona `Windows + R`
2. Escribe `cmd` y presiona Enter
3. Escribe el siguiente comando para ir a la carpeta del proyecto:
   ```
   cd C:\Users\clarr\Desktop\web_portafolio\portfolio-personal
   ```
4. Presiona Enter

**Cómo saber que estás en la carpeta correcta:**
La terminal debe mostrar algo así:
```
C:\Users\clarr\Desktop\web_portafolio\portfolio-personal>
```

---

## 6. Cómo arrancar el servidor local (ver cambios en tiempo real)

El servidor local te permite ver la web en tu ordenador antes de publicarla en internet. Los cambios que hagas en el código se reflejan automáticamente en el navegador.

### Primera vez (instalar dependencias)
Solo se hace una vez, o cuando alguien nuevo clona el proyecto:
```
pnpm install
```
Espera a que termine (puede tardar 1-2 minutos).

### Arrancar el servidor
```
pnpm dev
```

Verás algo así en la terminal:
```
  🚀 astro  v6.x.x started in XXms

  ┃ Local    http://localhost:4321/
  ┃ Network  http://192.168.x.x:4321/
```

Abre tu navegador y ve a: **http://localhost:4321**

Aquí verás tu web funcionando localmente.

### Parar el servidor
Cuando termines de trabajar, vuelve a la terminal y presiona `Ctrl + C`.

### Arrancar Sanity Studio local (para editar contenido con vista previa inmediata)
Si quieres ver los cambios de contenido al instante sin esperar al deploy:
```
cd sanity
pnpm dev
```
Se abre en: **http://localhost:3333**

Esto solo es necesario si estás editando contenido Y código al mismo tiempo. Para editar contenido normalmente, usa el Studio en la nube (ver sección 7).

---

## 7. Cómo editar el contenido de la web (Sanity Studio)

Sanity Studio es el panel de control donde editas todo el contenido de la web — proyectos, textos, fotos, CV — sin tocar código. Se accede desde el navegador.

### Acceder al panel

**URL del Studio en la nube:**
```
https://portfolio-personal.sanity.studio
```
(o la URL que te haya asignado Sanity al crear el proyecto)

**Credenciales:** Inicia sesión con tu cuenta de Google o email registrado en sanity.io

### Qué puedes editar

#### Proyectos
En la sección **"Proyecto"** puedes:
- **Crear un nuevo proyecto:** Botón `+` o `New document`
- **Editar uno existente:** Haz clic en él

Campos de cada proyecto:

| Campo | Descripción |
|---|---|
| **Título (ES)** | Nombre del proyecto en español |
| **Título (EN)** | Nombre en inglés (opcional) |
| **Descripción corta (ES)** | Texto que aparece al pasar el mouse sobre la tarjeta. Máximo 120 caracteres |
| **Descripción corta (EN)** | Ídem en inglés |
| **Contenido del proyecto (ES)** | Texto largo con imágenes, el cuerpo de la página del proyecto |
| **Contenido del proyecto (EN)** | Ídem en inglés |
| **Slug (URL)** | La dirección web del proyecto. Se genera automáticamente. Ej: `mi-proyecto` |
| **Categoría** | Arquitectura / Robótica / Impresión 3D / Escultura / Docencia |
| **Año** | Año del proyecto |
| **¿Proyecto destacado?** | Si está activo, aparece en la página de inicio |
| **Etiquetas** | Palabras clave (ej: "hormigón", "Arduino") |
| **Autores** | Nombres de los colaboradores |
| **Curso** | Nombre del curso (si aplica) |
| **Institución** | Universidad u organización |
| **Link de más información** | URL externa con más info |
| **Video hero** | Video que ocupa toda la pantalla al entrar al proyecto |
| **Imagen principal** | Foto de portada del proyecto (obligatoria) |
| **Galerías de imágenes** | Secciones de fotos con título personalizado (ej: "Construcción", "Resultado") |
| **URL del video (YouTube)** | Pega el link de YouTube para incrustar el video |

**Cómo subir múltiples fotos de una vez a una galería:**
1. En el proyecto, ve a la sección **"Galerías de imágenes"**
2. Haz clic en **"Add item"** para crear una sección (dale un título como "Proceso")
3. Dentro de esa sección, haz clic en **"Add item"** en Imágenes
4. Puedes **arrastrar y soltar** varias fotos a la vez o seleccionarlas con Ctrl+clic

#### CV
En la sección **"CV"** editas:
- **Educación:** Institución, programa, años, ciudad, descripción
- **Experiencia:** Empresa, cargo, año
- **Habilidades:** Lista de habilidades técnicas
- **Intereses:** Lista de intereses

#### Sobre mí
En la sección **"About"** editas:
- Biografía (ES e EN)
- Foto de perfil
- Educación resumida
- Habilidades
- Links a redes sociales

### Publicar cambios en Sanity
Cuando termines de editar, haz clic en el botón **"Publish"** (esquina superior derecha). Los cambios aparecen en la web en unos segundos (sin necesidad de hacer deploy).

---

## 8. Cómo editar el diseño y el código

Para cambios de diseño, estructura o funcionalidad, necesitas editar los archivos de código. Lo más fácil es usar **Claude Code** (ver sección 14), pero si quieres hacerlo manualmente:

### Abrir el proyecto en Visual Studio Code
1. Abre VS Code
2. Ve a `Archivo > Abrir carpeta`
3. Selecciona `C:\Users\clarr\Desktop\web_portafolio\portfolio-personal`

### Archivos que editarás más frecuentemente

| Quieres cambiar... | Archivo a editar |
|---|---|
| El menú de navegación | `src/components/layout/Header.astro` |
| El pie de página | `src/components/layout/Footer.astro` |
| La página de inicio | `src/pages/index.astro` |
| La página de proyectos | `src/pages/proyectos/index.astro` |
| El diseño de cada proyecto | `src/pages/proyectos/[slug].astro` |
| La página del CV | `src/pages/cv.astro` y `src/components/sections/CVContent.astro` |
| La página de contacto | `src/pages/contacto.astro` |
| Los filtros de categorías | `src/components/ui/CategoryFilter.tsx` |
| El formulario de contacto | `src/components/ui/ContactForm.tsx` |
| Las traducciones ES/EN | `src/lib/i18n.ts` |
| Agregar categorías nuevas | `sanity/schemas/project.ts` + `src/components/ui/CategoryFilter.tsx` |

### Cómo agregar una nueva categoría de proyecto
1. Abre `sanity/schemas/project.ts`
2. Busca el campo `category` y agrega una línea al `list`:
   ```typescript
   { title: 'Fotografía', value: 'fotografia' },
   ```
3. Abre `src/components/ui/CategoryFilter.tsx`
4. Agrega la traducción en ambos objetos:
   ```typescript
   // En categoryLabelsEs:
   fotografia: 'Fotografía',
   // En categoryLabelsEn:
   fotografia: 'Photography',
   ```
5. Guarda los archivos y haz deploy (sección 9)

---

## 9. Cómo publicar cambios en la web real (deploy)

Cada vez que cambies código (no contenido de Sanity), necesitas publicarlo. El proceso es:

### Paso 1: Verificar qué cambió
```
git status
```
Mostrará en rojo los archivos modificados.

### Paso 2: Preparar los cambios
```
git add -A
```
Esto selecciona todos los archivos modificados para incluirlos en el commit.

### Paso 3: Guardar los cambios con un mensaje descriptivo
```
git commit -m "Descripción de lo que cambiaste"
```
Ejemplo: `git commit -m "Agrego categoría fotografía"`

### Paso 4: Publicar en internet
```
git push
```

Después del `git push`, Vercel detecta automáticamente los cambios y despliega la web. En 1-3 minutos, los cambios están en vivo.

### Ver el estado del deploy
Ve a: https://vercel.com → tu proyecto → pestaña **"Deployments"**
Verás si el deploy está en progreso, fue exitoso o falló.

---

## 10. Cómo actualizar el CV y el Portafolio PDF

Los PDFs se guardan directamente en la carpeta del proyecto y se actualizan reemplazando los archivos.

### Archivos PDF y su ubicación
```
portfolio-personal/public/cv/
├── CV_Carlos Larraín Lihn_ES.pdf       ← CV en español
├── CV_Carlos Larraín Lihn_EN.pdf       ← CV en inglés
├── Portfolio_Carlos Larraín L_ES.pdf   ← Portafolio en español
└── Portfolio_Carlos Larraín L_EN.pdf   ← Portafolio en inglés
```

### Pasos para actualizar un PDF
1. Prepara el nuevo PDF con **exactamente el mismo nombre** que el archivo que quieres reemplazar
2. Copia el archivo nuevo a la carpeta `public/cv/` (reemplaza el antiguo)
3. Abre la terminal en la carpeta del proyecto
4. Ejecuta:
   ```
   git add public/cv/
   git commit -m "Actualizo PDF del CV"
   git push
   ```
5. En 1-3 minutos el nuevo PDF estará disponible en la web

> **Importante:** Los PDFs pueden pesar hasta ~100 MB sin problema. Si pesan más, consulta la sección de preguntas frecuentes.

---

## 11. Cómo funciona el formulario de contacto

Cuando alguien rellena el formulario de contacto, el mensaje llega a tu email a través del servicio **Resend**.

### Flujo del mensaje
```
Visitante rellena formulario
       ↓
La web llama a /api/contact
       ↓
Resend envía el email
       ↓
Tú recibes el email en clarrainlihn@gmail.com
```

### Requisitos para que funcione
1. La variable `RESEND_API_KEY` debe estar configurada en Vercel (ver sección 12)
2. La variable `CONTACT_EMAIL` debe apuntar a tu email

### Si no llegan los emails — pasos para diagnosticar
1. Ve a https://resend.com → inicia sesión → **"Emails"** — verás el historial de emails enviados y si hubo errores
2. Ve a https://vercel.com → tu proyecto → **"Settings"** → **"Environment Variables"** — verifica que `RESEND_API_KEY` esté configurada
3. Si el email llega a Resend pero no a Gmail, revisa la carpeta de spam

---

## 12. Variables de entorno (contraseñas y claves)

Las variables de entorno son las "contraseñas" que conectan la web con los servicios externos. Se guardan en dos lugares:

### En tu ordenador (archivo `.env`)
Ubicación: `portfolio-personal/.env`

```
SANITY_PROJECT_ID=zoh6ht03
SANITY_DATASET=production
SANITY_API_TOKEN=[tu token de Sanity]
RESEND_API_KEY=[tu API key de Resend]
CONTACT_EMAIL=clarrainlihn@gmail.com
PUBLIC_SITE_URL=https://[tu-dominio].vercel.app
```

> **NUNCA subas el archivo `.env` a GitHub.** Está protegido en `.gitignore` y no se sube.

### En Vercel (para la web en producción)
Las mismas variables deben estar en Vercel para que la web en internet funcione:

1. Ve a https://vercel.com
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable con su valor

### Dónde conseguir cada clave

**SANITY_API_TOKEN:**
1. Ve a https://sanity.io → tu proyecto
2. **Settings** → **API** → **Tokens**
3. Crea un token con permisos de **"Viewer"** (solo lectura)

**RESEND_API_KEY:**
1. Ve a https://resend.com → inicia sesión
2. **API Keys** → **Create API Key**

**SANITY_PROJECT_ID:**
Ya está hardcodeado en el código: `zoh6ht03`

---

## 13. Cómo ver la analítica de la web

### Analítica de Vercel (visitas, países, páginas más vistas)
1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto del portfolio
4. Haz clic en la pestaña **"Analytics"**

Aquí verás:
- Número de visitas por día/semana/mes
- Países de origen de los visitantes
- Páginas más visitadas
- Tiempo de carga

> Si no ves datos, puede que sea necesario activar Analytics en Vercel (plan gratuito incluye analítica básica).

### GitHub (actividad del código)
1. Ve a https://github.com/Clarrainl/portfolio-personal
2. Aquí verás el historial de todos los cambios realizados en el código

---

## 14. Cómo volver a esta conversación con Claude para seguir editando

Claude Code es la IA que te ayuda a editar el código de la web. Para retomar el trabajo:

### Opción A — Desde Claude.ai/code (recomendado)
1. Ve a https://claude.ai/code
2. Inicia sesión con tu cuenta de Anthropic/Claude
3. En el panel izquierdo busca el proyecto `C:\Users\clarr\Desktop\web_portafolio\portfolio-personal`
4. La conversación anterior debería aparecer — haz clic en ella para continuarla

### Opción B — Desde la terminal
1. Abre la terminal en la carpeta del proyecto:
   ```
   cd C:\Users\clarr\Desktop\web_portafolio\portfolio-personal
   ```
2. Escribe:
   ```
   claude
   ```
3. Esto abre Claude Code directamente en el contexto del proyecto

### Cómo pedirle cambios a Claude
Sé específico con lo que quieres. Ejemplos de buenos mensajes:
- "Quiero que el título de la página de inicio sea más grande y en color azul"
- "Agrega una nueva sección en la página de contacto con mi número de teléfono"
- "El menú en mobile no se ve bien, ¿puedes arreglarlo?"
- "Agrega la categoría 'Fotografía' a los proyectos"

Después de que Claude haga cambios:
1. Verifica que se ven bien en http://localhost:4321
2. Dile a Claude que haga commit: "haz commit de los cambios y push"

---

## 15. Preguntas frecuentes y solución de problemas

### La web local no arranca / da error
```
pnpm install
pnpm dev
```
Si sigue fallando, cierra la terminal, ábrela de nuevo y repite.

### "port 4321 is already in use"
Significa que el servidor ya está corriendo. Ve a http://localhost:4321 directamente, o cierra la terminal anterior.

### Los cambios en Sanity no aparecen en local
El servidor local tarda unos segundos en detectar los cambios de Sanity. Si después de 30 segundos no aparecen, para el servidor (`Ctrl+C`) y arráncalo de nuevo (`pnpm dev`).

### Quiero subir un video al hero de un proyecto pero es muy pesado
Los videos de más de 100 MB no se pueden subir a GitHub directamente. Las opciones son:
1. **Comprimir el video** con HandBrake (gratis): https://handbrake.fr — apunta a menos de 80 MB
2. **Usar YouTube:** Sube el video a YouTube y usa la opción "URL del video (YouTube)" en Sanity

### El formulario de contacto muestra "mensaje enviado" pero no llega el email
1. Revisa la carpeta de spam en Gmail
2. Ve a https://resend.com → **Emails** — verifica si el email aparece ahí
3. Verifica las variables de entorno en Vercel (sección 12)

### Quiero cambiar el dominio de la web
1. Compra un dominio (ej: en namecheap.com o Google Domains)
2. Ve a Vercel → tu proyecto → **Settings** → **Domains**
3. Agrega tu dominio y sigue las instrucciones de Vercel para configurar los DNS

### Quiero hacer una copia de seguridad
El código está guardado en GitHub: https://github.com/Clarrainl/portfolio-personal
El contenido está guardado en Sanity (en la nube).
No necesitas hacer backups manuales, ambos servicios los hacen automáticamente.

### Quiero que otra persona pueda editar el contenido (Sanity)
1. Ve a https://sanity.io → tu proyecto
2. **Settings** → **Members** → **Invite**
3. Ingresa el email de la persona — recibirá una invitación

### Quiero que otra persona pueda editar el código (GitHub)
1. Ve a https://github.com/Clarrainl/portfolio-personal
2. **Settings** → **Collaborators** → **Add people**
3. Ingresa su usuario de GitHub

---

## 16. Resumen de cuentas y accesos

| Servicio | URL | Usuario / Email |
|---|---|---|
| **Sanity Studio** (contenido) | sanity.io | Tu cuenta Google o email |
| **Sanity Project ID** | — | `zoh6ht03` |
| **Sanity Dataset** | — | `production` |
| **Vercel** (hosting) | vercel.com | Tu cuenta GitHub/Google |
| **GitHub** (código) | github.com/Clarrainl/portfolio-personal | Clarrainl |
| **Resend** (emails) | resend.com | Tu cuenta email |
| **Claude Code** (edición IA) | claude.ai/code | Tu cuenta Anthropic |

---

## Comandos de referencia rápida

```bash
# Ir a la carpeta del proyecto
cd C:\Users\clarr\Desktop\web_portafolio\portfolio-personal

# Arrancar el servidor local
pnpm dev

# Abrir en el navegador
# → http://localhost:4321

# Publicar cambios en internet
git add -A
git commit -m "Descripción del cambio"
git push

# Instalar dependencias (solo si hay problemas o en ordenador nuevo)
pnpm install

# Ver estado de los cambios
git status

# Ver historial de cambios
git log --oneline
```

---

*Última actualización: Abril 2026*
*Web construida con Astro 6 · React 19 · Tailwind CSS v4 · Sanity CMS · Vercel · Resend*
