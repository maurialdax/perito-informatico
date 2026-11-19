# Gestión de Peritos Informáticos

Prototipo para el Ministerio de Seguridad: alta, baja lógica y consulta de peritos.
Stack: Node.js, Express, Sequelize, SQLite (desarrollo) / PostgreSQL (producción), Morgan y Chalk.

## Requisitos

- Node.js 18 o superior
- Docker (solo si se quiere usar PostgreSQL)

## Cómo ejecutarlo (SQLite, desarrollo)

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm start
```

El repositorio incluye `forensics.db` con los roles y 4 usuarios de prueba.
Si se quiere regenerar la base de cero: borrar `forensics.db` y ejecutar `npm run seed`.

El servidor queda en `http://localhost:3000`.

## Cómo ejecutarlo con PostgreSQL (producción)

1. Levantar el contenedor: `docker compose up -d`
2. En `.env` cambiar `DB_DIALECT=postgres`
3. (Opcional) cargar datos de prueba: `npm run seed`
4. `npm start`

Los modelos y controladores son los mismos; solo cambia la conexión (`src/config/database.js`).

## Endpoints

| Método | Ruta                    | Descripción                                   | Respuestas        |
|--------|-------------------------|-----------------------------------------------|-------------------|
| POST   | /api/v1/peritos         | Registra un perito (`username`, `role_id`)    | 201, 400, 409     |
| GET    | /api/v1/peritos         | Lista peritos activos (`?role=ADMIN` filtra)  | 200, 400          |
| GET    | /api/v1/peritos/:id     | Detalle de un perito activo                   | 200, 400, 404     |
| DELETE | /api/v1/peritos/:id     | Baja lógica (`active = false`)                | 200, 400, 404     |

## Ejemplos

```bash
# Crear
curl -X POST http://localhost:3000/api/v1/peritos \
  -H "Content-Type: application/json" \
  -d '{"username": "perito.nuevo", "role_id": 2}'

# Listar y filtrar por rol
curl http://localhost:3000/api/v1/peritos
curl "http://localhost:3000/api/v1/peritos?role=ADMIN"

# Obtener uno
curl http://localhost:3000/api/v1/peritos/1

# Baja lógica
curl -X DELETE http://localhost:3000/api/v1/peritos/1
```

Roles precargados: 1 = ADMIN, 2 = FORENSIC_INSPECTOR, 3 = AUDITOR.

## Consola

- Morgan muestra una línea por cada petición HTTP.
- Chalk: **cyan** al crear un perito, **yellow** en errores de validación (con el campo fallido), **red** en errores 500 (con el stack).

## Estructura

```
src/
  config/database.js        conexión dinámica SQLite / PostgreSQL
  models/                   Role, User y asociaciones (clave foránea)
  controllers/              lógica de los endpoints
  routes/                   rutas de /api/v1/peritos
  middlewares/errorHandler  404 y manejo central de errores
  utils/                    logger (Chalk) y validadores
  seeds/                    carga de roles y usuarios de prueba
```
