# Medioteca

Hola revisor 👋. Espero que le guste el proyecto 😁

## Estructura del Proyecto

- **Backend**: API REST ASP.NET Core 10.0 con base de datos SQLite
- **Frontend**: Angular 21 con Tailwind CSS y Spartan UI
- **Nginx**: Reverse proxy para enrutamiento

## Requisitos **Previos**

- Docker y Docker Compose (recomendado)
- (Opcional) .NET 10.0 SDK para desarrollo local del backend
- (Opcional) Node.js 21+ y pnpm/npm para desarrollo local del frontend

## Inicio Rápido

### Usando Docker Compose (Recomendado)

1. Iniciar todos los servicios:

```bash
docker-compose up --build -d
```

2. Acceder a la aplicación:
   - **Frontend**: http://localhost/app
   - **API Backend**: http://localhost/api/
   - **Swagger**: http://localhost/api/scalar (en modo Development)

3. Hacer login:
   
He dejado un usuario admin por defecto:
   - **Usuario**: admin@gmail.com
   - **Contraseña**: 12345678
O bien, registrarse como nuevo usuario.


## Servicios

### API **Backend**

- **Puerto**: 5000 (expuesto), 8080 (interno)
- **Base de datos**: SQLite con volumen persistente en `./Data`
- **Entorno**: Se puede configurar mediante la variable `ASPNETCORE_ENVIRONMENT` en el contenedor
- **Tecnología**: ASP.NET Core 10.0, Entity Framework Core

#### Endpoints

##### Autenticación

- `POST /api/Auth/Register` - Registrar nuevo usuario
- `POST /api/Auth/Login` - Iniciar sesión y obtener token JWT
- `POST /api/Auth/refresh-token` - Refrescar token JWT

##### Usuarios

- `GET /api/Users/me` - Obtener perfil del usuario autenticado
- `PATCH /api/Users/me` - Actualizar perfil del usuario autenticado
- `GET /api/Users` - Listar usuarios (solo admin)
- `DELETE /api/Users/{id}` - Desactiva o activa un usuario (solo admin)

##### Media (Obras)

- `GET /api/Media` - Listar obras con paginación y filtros
- `GET /api/Media/{id}` - Obtener detalles de una obra
- `POST /api/Media` - Crear nueva obra (solo admin)
- `GET /api/Media/types` - Obtener tipos de contenido disponibles

#### Parámetros de Consulta

- `page` - Número de página (predeterminado: 1)
- `pageSize` - Elementos por página (predeterminado: 10) (máximo: 100)
- `mediaType` - Filtrar por tipo de contenido de una obra (Movie, Series, Documentary)
- `searchTerm` - Buscar en nombre y descripción

### Frontend

- **Puerto**: 3000 (interno), accesible vía nginx en http://localhost/app
- **Tecnología**: Angular, TypeScript, Tailwind CSS, Spartan UI

### Nginx

- **Puerto**: 80
- **Rutas**:
  - `/app` → Frontend
  - `/api` → API Backend
  - `/` → Redirige a `/app`

## Base de Datos

La base de datos SQLite se persiste en un volumen Docker montado en `./Data/Medioteca.db`. Esto asegura que los datos persistan entre reinicios del contenedor.

## Variables de Entorno

### Variables del Backend

- `ASPNETCORE_ENVIRONMENT` - Entorno (Development/Production)
- `ConnectionStrings__SQLiteDefault` - Cadena de conexión a la base de datos SQLite
