# API Planificador de Viajes

API backend desarrollada con NestJS, TypeScript, Prisma y PostgreSQL. Permite a los usuarios registrarse, autenticarse, y gestionar sus viajes junto con las actividades planificadas dentro de cada uno.

**Autora:** Micaela Franco Torres

**Idea heredada del Segundo Proyecto Integrador:** planificador de viajes, donde cada usuario organiza sus viajes y las actividades asociadas a cada uno (destino, fechas, presupuesto, actividades con costo).

## Tecnologías utilizadas

- NestJS 12 + TypeScript
- Prisma ORM + PostgreSQL (base de datos alojada en Neon)
- Autenticación JWT (access + refresh tokens) con `@nestjs/jwt` y `passport-jwt`
- Hasheo de contraseñas con `bcryptjs`
- Validación de datos con `class-validator` y `class-transformer`
- Seguridad HTTP con `helmet`, `cors` y `@nestjs/throttler` (rate limiting)
- Documentación interactiva con `@nestjs/swagger`
- Gestor de paquetes: `pnpm`

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MicaelaFrancoTorres/api-planificador-viajes.git
cd api-planificador-viajes
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Crear un archivo `.env` en la raíz del proyecto, basándote en `.env.example`, con tus propias credenciales:
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_basededatos?sslmode=require"
JWT_SECRET="tu-clave-secreta-para-access-tokens"
JWT_REFRESH_SECRET="tu-clave-secreta-para-refresh-tokens"


4. Ejecutar las migraciones de Prisma:
```bash
pnpm prisma migrate dev
```

5. Levantar el servidor en modo desarrollo:
```bash
pnpm run start:dev
```

La API queda disponible en `http://localhost:3000`.

## Variables de entorno necesarias

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a la base de datos PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar los access tokens |
| `JWT_REFRESH_SECRET` | Clave secreta para firmar los refresh tokens |

## Links

- **Repositorio:** https://github.com/MicaelaFrancoTorres/api-planificador-viajes
- **Deploy:** *(pendiente de completar)*

## Documentación interactiva (Swagger)

Además de la tabla de endpoints más abajo, la API cuenta con documentación interactiva generada con Swagger. Una vez que el servidor esté corriendo, se puede acceder desde:
http://localhost:3000/api


Desde ahí se puede probar cada endpoint directamente, incluyendo los protegidos con JWT (usando el botón "Authorize" para pegar el access token obtenido en `/auth/login`).

## Endpoints disponibles

### Autenticación

| Método | Ruta | Descripción | Protegido |
|---|---|---|---|
| POST | `/auth/register` | Crea un usuario nuevo (contraseña hasheada) | No |
| POST | `/auth/login` | Valida credenciales, devuelve access y refresh token | No |
| POST | `/auth/refresh` | Renueva el access token a partir de un refresh token válido | No |
| POST | `/auth/logout` | Invalida los refresh tokens del usuario | Sí (JWT) |

### Viajes

| Método | Ruta | Descripción | Protegido |
|---|---|---|---|
| POST | `/viajes` | Crea un viaje asociado al usuario logueado | Sí (JWT) |
| GET | `/viajes` | Lista los viajes del usuario, con sus actividades | Sí (JWT) |
| GET | `/viajes/:id` | Obtiene un viaje, incluyendo gasto total y días restantes calculados | Sí (JWT) |
| PATCH | `/viajes/:id` | Edita un viaje (solo si pertenece al usuario) | Sí (JWT) |
| DELETE | `/viajes/:id` | Elimina un viaje (solo si pertenece al usuario) | Sí (JWT) |

### Actividades (anidadas dentro de un viaje)

| Método | Ruta | Descripción | Protegido |
|---|---|---|---|
| POST | `/viajes/:viajeId/actividades` | Crea una actividad dentro de un viaje propio | Sí (JWT) |
| GET | `/viajes/:viajeId/actividades` | Lista las actividades de un viaje propio | Sí (JWT) |
| GET | `/viajes/:viajeId/actividades/:id` | Obtiene una actividad puntual | Sí (JWT) |
| PATCH | `/viajes/:viajeId/actividades/:id` | Edita una actividad | Sí (JWT) |
| DELETE | `/viajes/:viajeId/actividades/:id` | Elimina una actividad | Sí (JWT) |

## Seguridad implementada

- Contraseñas hasheadas con `bcryptjs` (costo 10), nunca devueltas en las respuestas.
- Autenticación JWT con access token de corta duración (15 min) y refresh token de larga duración (7 días).
- Los refresh tokens se guardan hasheados en la base de datos y pueden ser revocados (logout).
- Todas las rutas que exponen o modifican datos del usuario están protegidas con `JwtAuthGuard`.
- Verificación de "ownership": cada usuario solo puede ver, editar o borrar sus propios viajes y actividades.
- `ValidationPipe` global con `whitelist` y `forbidNonWhitelisted`, que rechaza cualquier propiedad no declarada en los DTOs.
- `helmet` para headers de seguridad HTTP.
- `cors` configurado.
- Rate limiting global con `@nestjs/throttler` (20 requests por minuto por IP).

## Modelo de datos

El modelo completo está definido en `prisma/schema.prisma`, con los siguientes modelos:

- **User**: usuarios de la aplicación (email, contraseña hasheada).
- **RefreshToken**: refresh tokens hasheados, asociados a un usuario, con posibilidad de revocación.
- **Viaje**: viajes creados por un usuario (destino, fechas, presupuesto, notas).
- **Actividad**: actividades dentro de un viaje (nombre, fecha, costo, notas).