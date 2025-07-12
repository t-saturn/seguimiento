# Sistema de Seguimiento Documentario (SGD) - Municipalidad Distrital de Kimbiri

<p align="center">
  <img src="https://res.cloudinary.com/dmr9ef5cl/image/upload/v1745974829/srbf6xjhhnx8nw3siozq.png" alt="Logo Kimbiri" width="120" />
</p>

<p align="center">
  Municipalidad Distrital de Kimbiri · Seguimiento de Trámite Documentario <br/>
  <code>/consulta</code> para público · <code>/seguimiento</code> con autenticación
</p>

---

## 🔍 Funcionalidades Principales

| Ruta             | Descripción                                                                 |
|------------------|-----------------------------------------------------------------------------|
| [`/consulta`](#) | ✅ Consulta pública por número de expediente o mesa de partes                |
| [`/seguimiento`](#) | 🔐 Consulta privada con autenticación para seguimiento detallado          |

---

## 📸 Capturas de Pantalla

| Consulta Pública `/consulta` | Seguimiento Privado `/seguimiento` |
|-----------------------------|-------------------------------------|
| ![Consulta Pública](https://res.cloudinary.com/dmr9ef5cl/image/upload/v1748659307/q9gtzvnulzdqmibdhbzc.png) | ![Privado](https://res.cloudinary.com/dmr9ef5cl/image/upload/v1748659380/naosh3kesl8zgmltyoql.png) |

---

## 🧩 Características

- 📦 **Next.js 15 + App Router** para una arquitectura moderna y escalable
- 🎨 **Tailwind CSS** para un diseño responsivo y accesible
- 🔐 **Turnstile CAPTCHA** para proteger consultas públicas
- 🌐 **Adaptable a múltiples entidades** municipales o locales
- 🚀 **Rendimiento optimizado** con carga rápida para dispositivos móviles
- 🧠 Integración con el backend del **Sistema de Trámite Documentario (SGD)** de la Municipalidad Distrital de Kimbiri

---

## 🚦 Requisitos

- Node.js ≥ 18
- Gestor de paquetes: Bun o npm
- Archivo `.env` configurado con `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y otras variables
- Acceso a la API del backend SGD (interno o público)

---

## ⚙️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/leodev15/seguimiento-docs.git

# Entra al directorio del proyecto
cd seguimiento-docs

# Instala las dependencias
bun install

# Inicia el servidor en modo desarrollo
bun run dev
```

---

## 🛠 Variables de Entorno `.env`

```env
AUTH_SECRET=
PGHOST=
PGPORT=
PGDATABASE=
PGUSER=
PGPASSWORD=
NEXTAUTH_URL=
SGD_SECRET_KEY_PASSWORD=
COOKIE_PREFIX=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_BACKEND_API_URL=
```

---

## 📌 Notas Técnicas

- ⚠️ Uso de `<Suspense>` para envolver `useSearchParams()` y evitar errores en producción.
- ✅ El botón de búsqueda requiere verificación exitosa del CAPTCHA.
- 🔧 Configurable para otras municipalidades o entidades públicas del Perú.

---

## 📢 Créditos

> Desarrollado por la Oficina de Tecnologías de Información y Comunicaciones  
> **Municipalidad Distrital de Kimbiri**  
> 🏛️ Eficiencia y transparencia al servicio del ciudadano.

---

## 🖼 Licencia

MIT © Municipalidad Distrital de Kimbiri
