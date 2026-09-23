# <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /> NOTES APP — ENSOLVERS FULLSTACK EXERCISE <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />

[![LIVE APP](https://img.shields.io/badge/live%20app-%23323330.svg?&style=for-the-badge&logo=netlify&logoColor=white&color=00C7B7)](https://delightful-pastelito-180611.netlify.app)
[![LIVE API](https://img.shields.io/badge/live%20api-%23323330.svg?&style=for-the-badge&logo=render&logoColor=white&color=000000)](https://notes-backend-1tnf.onrender.com)
[![REPOSITORIO](https://img.shields.io/badge/repositorio-%23323330.svg?&style=for-the-badge&logo=github&logoColor=white&color=181717)](https://github.com/hirelens-challenges/HuancaParqui-334763)

Aplicación fullstack de notas (SPA) desarrollada como ejercicio técnico para Ensolvers. Permite crear, editar, archivar y categorizar notas, con persistencia real en PostgreSQL vía JPA/Hibernate + Liquibase (sin mocks ni almacenamiento en memoria).

## Menu
- [Demo en vivo](#demo-en-vivo)
- [Login](#login)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos y versiones](#requisitos-y-versiones)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Despliegue](#despliegue)

---

## Demo en vivo

Tipo | URL
------------ | -------------
<img src="https://img.shields.io/badge/frontend%20-%23323330.svg?&style=for-the-badge&logo=netlify&logoColor=white&color=00C7B7" /> | https://delightful-pastelito-180611.netlify.app
<img src="https://img.shields.io/badge/backend%20api%20-%23323330.svg?&style=for-the-badge&logo=render&logoColor=white&color=000000" /> | https://notes-backend-1tnf.onrender.com/api

> El backend corre en el plan gratuito de Render, que "duerme" el servicio tras un rato de inactividad. La primera petición después de eso puede tardar hasta ~50 segundos mientras despierta — no es un error, solo hay que esperar.

## Login

La app está protegida con autenticación real (HTTP Basic vía Spring Security), respaldada por una tabla `users` en PostgreSQL — no hay ningún usuario hardcodeado ni sembrado por defecto. En la pantalla de login, usa el link **"Créala"** para registrar tu propia cuenta antes de iniciar sesión.

Cada usuario ve y administra **solo sus propias notas y categorías** — nunca las de otro usuario registrado.

## Stack tecnológico

Capa | Tecnología
------------ | -------------
<img src="https://img.shields.io/badge/backend%20-%23323330.svg?&style=for-the-badge&logo=spring&logoColor=white&color=6DB33F" /> | Java 21 · Spring Boot 4.1.0 · Spring Data JPA (Hibernate) · Spring Security · Liquibase · WebSocket/STOMP
<img src="https://img.shields.io/badge/frontend%20-%23323330.svg?&style=for-the-badge&logo=react&logoColor=black&color=61DAFB" /> | React 19 · TypeScript · Vite 8 · Material UI · React Router
<img src="https://img.shields.io/badge/base%20de%20datos%20-%23323330.svg?&style=for-the-badge&logo=postgresql&logoColor=white&color=4169E1" /> | PostgreSQL 16
<img src="https://img.shields.io/badge/infra%20-%23323330.svg?&style=for-the-badge&logo=docker&logoColor=white&color=2496ED" /> | Docker Compose (desarrollo local) · Render (backend + BD) · Netlify (frontend)

## Requisitos y versiones

Herramienta | Versión usada en desarrollo
------------ | -------------
Java (JDK) | 21 (probado con 21.0.10)
Maven | No requiere instalación — se usa el wrapper incluido (`./mvnw`)
Node.js | 25.8.1
npm | 11.11.0
Docker | 29.7.2
Docker Compose | 5.5.0 (compatible con `docker compose` v2 y `docker-compose` v1)
PostgreSQL | 16 (se levanta automáticamente vía Docker, no requiere instalación manual)

> **Nota sobre Docker**: si no usas Docker Desktop, puedes usar [Colima](https://github.com/abiosoft/colima) como motor de contenedores en macOS:
> ```bash
> brew install docker docker-compose colima
> colima start
> ```

## Cómo correr el proyecto

### Opción 1 — Un solo comando (recomendado)

Desde la raíz del repositorio:

```bash
./run.sh
```

Esto construye la imagen del backend, levanta PostgreSQL y el backend juntos (esperando a que la base de datos esté saludable antes de arrancar la API), y ejecuta las migraciones de Liquibase automáticamente. No necesitas tener Java, Maven ni PostgreSQL instalados — solo Docker.

Backend disponible en `http://localhost:8080`.

Para correr también el frontend contra él, en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`. Lee la URL del backend desde `frontend/.env` (`VITE_API_URL`), ya apuntada a `http://localhost:8080/api`.

### Opción 2 — Backend sin Docker (Docker solo para Postgres)

```bash
cd backend
./mvnw spring-boot:run
```

Por defecto usa la integración de Docker Compose de Spring Boot (`backend/compose.yaml`) para levantar un Postgres local automáticamente — igual necesitas Docker instalado para esto, pero no para compilar/correr la app en sí. Liquibase crea el schema automáticamente al arrancar; no hay ningún paso manual de configuración de base de datos.

El frontend se corre igual que en la Opción 1.

> `compose.yaml` (raíz) es distinto de `backend/compose.yaml` — el de la raíz levanta **backend + Postgres** juntos (Opción 1); el de `backend/` solo levanta **Postgres**, para cuando corres el backend directo con `./mvnw spring-boot:run` (Opción 2). No los uses a la vez, chocan en el puerto 5432.

## Estructura del repositorio

```
HuancaParqui-334763/
├── backend/          # API REST — Spring Boot (Controller → Service → Repository)
│   └── Dockerfile    # Imagen del backend (multi-stage: build con Maven, runtime con JRE)
├── frontend/         # SPA — React + Vite + TypeScript
├── compose.yaml      # Stack completo en contenedores (backend + Postgres)
├── render.yaml       # Blueprint de despliegue en Render (backend + BD gestionada)
└── run.sh            # Script de arranque en un solo comando
```

## Funcionalidades

### Fase 1 (obligatoria)
- [x] Crear, editar y borrar notas
- [x] Archivar / desarchivar notas
- [x] Listar notas activas
- [x] Listar notas archivadas

### Fase 2 (extra)
- [x] Agregar / quitar categorías a una nota
- [x] Filtrar notas por categoría

### Extra
- [x] Registro y login reales (Spring Security, HTTP Basic, tabla `users` en Postgres)
- [x] Notas y categorías privadas por usuario — cada quien ve y administra solo lo suyo
- [x] Sincronización en tiempo real entre sesiones del mismo usuario (WebSocket/STOMP)
- [x] Deploy en vivo (Render + Netlify)
- [x] Backend containerizado (Dockerfile + `docker compose up`, sin depender de Java/Maven instalados)
- [x] Interfaz con Material UI en login, registro y notas

## Arquitectura

**Backend** — capas separadas siguiendo el patrón Service Layer:

```
Controller (REST, @RestController)
    ↓
Service (lógica de negocio, @Transactional)
    ↓
Repository (Spring Data JPA)
    ↓
PostgreSQL (vía Hibernate + migraciones versionadas con Liquibase)
```

- `Note` y `Category` tienen una relación muchos-a-muchos (`note_categories`); cada una además pertenece a un `AppUser` (uno-a-muchos), y toda consulta se filtra por el usuario autenticado.
- Cambios (crear/editar/borrar nota o categoría) se notifican en tiempo real vía WebSocket/STOMP a las demás sesiones abiertas del mismo usuario.
- Los DTOs (`NoteRequestDto`, `NoteResponseDto`, `CategoryRequestDto`, `CategoryResponseDto`) desacoplan el contrato REST del modelo de persistencia.
- El schema de la base de datos se versiona con Liquibase (`db/changelog/`), no con `ddl-auto` de Hibernate.

**Frontend** — SPA en React con capa de servicios separada de los componentes:

```
components/ (NoteForm, NoteList, Sidebar, Login, Register, ConfirmDialog...)
    ↓
services/ (noteService, categoryService, authService, http.ts, realtime.ts)
    ↓
API REST + WebSocket del backend
```

## Despliegue

Componente | Plataforma | Notas
------------ | ------------- | -------------
Backend + PostgreSQL | [Render](https://render.com) | Desplegado vía Blueprint (`render.yaml`): construye la imagen Docker del backend y aprovisiona una base Postgres gestionada, conectando ambos automáticamente por variables de entorno.
Frontend | [Netlify](https://netlify.com) | Build de Vite con `VITE_API_URL` apuntando al backend de Render.

Variables de entorno del servicio backend en Render (las `DB_*` se conectan solas desde la base de datos vía el Blueprint, no se copian a mano):

```
SPRING_PROFILES_ACTIVE=prod
JDK_JAVA_OPTIONS=-Xmx400m
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD   ← auto-conectadas desde notes-db
APP_CORS_ALLOWED_ORIGINS=https://delightful-pastelito-180611.netlify.app
```

Variable de entorno configurada en Netlify (proyecto frontend):

```
VITE_API_URL=https://notes-backend-1tnf.onrender.com/api
```

---

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ElizabethYasmin">
        <img src="https://avatars.githubusercontent.com/u/62725994?v=4" width="100px;" alt="Foto de perfil de GitHub"/><br>
        <sub>
          <b>Elizabeth Yasmin Huanca Parqui</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
