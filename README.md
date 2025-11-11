# Proyecto 3 - Catálogo de Pinturas Famosas con Redis

Aplicación web completa con backend en **Redis**, **Netlify Functions** y frontend en **Vue.js**.

## 🎯 Características

- ✅ **Base de datos Redis** (Redis.com)
- ✅ **Backend con Netlify Functions** (FaaS)
- ✅ **Operaciones CRUD completas** para 3 entidades
- ✅ **Autenticación JWT**
- ✅ **Frontend Vue.js** moderno y responsive
- ✅ **12 pinturas, 6 artistas, 6 museos**

## 📋 Requisitos Previos

1. **Node.js** 18+ y npm/pnpm
2. **Cuenta en Redis.com** (gratuita)
3. **Netlify CLI** (opcional para desarrollo local)

## 🚀 Configuración

### 1. Crear Base de Datos Redis

1. Ve a https://redis.com/try-free/
2. Crea una cuenta gratuita
3. Crea una nueva base de datos (Free tier - 30MB)
4. Obtén la **URL de conexión** en formato:
   ```
   redis://default:PASSWORD@HOST:PORT
   ```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REDIS_URL=redis://default:TU_PASSWORD@TU_HOST:TU_PORT
JWT_SECRET=proyecto3-secret-key-super-seguro-cambiar-en-produccion
```

### 3. Instalar Dependencias

```bash
# Dependencias del backend
npm install

# Dependencias del frontend
cd frontend && npm install && cd ..
```

### 4. Cargar Datos Iniciales

```bash
# Cargar pinturas, artistas y museos
npm run seed

# Cargar usuarios de prueba
npm run seed-users
```

> 💡 **Tip:** En Netlify o en cualquier entorno remoto, las funciones comprueban automáticamente si Redis está vacío y poblan los catálogos y usuarios de prueba en el primer acceso. Si necesitas forzar la carga manual en otro Redis, exporta la variable `REDIS_URL` apuntando a esa instancia antes de ejecutar los comandos anteriores.

### 5. Compilar Frontend

```bash
cd frontend && npm run build && cd ..
```

### 6. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre http://localhost:8888

## 👥 Usuarios de Prueba

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**Usuario Normal:**
- Usuario: `usuario`
- Contraseña: `usuario123`

## 📡 Endpoints API

### Autenticación

```
POST /api/auth-login
POST /api/auth-register
GET  /api/auth-me
```

### Pinturas

```
GET    /api/pinturas       # Todas las pinturas
GET    /api/pinturas/:id   # Una pintura
POST   /api/pinturas       # Crear pintura
PUT    /api/pinturas/:id   # Actualizar pintura
DELETE /api/pinturas/:id   # Eliminar pintura
```

### Artistas

```
GET    /api/artistas       # Todos los artistas
GET    /api/artistas/:id   # Un artista (con sus obras)
POST   /api/artistas       # Crear artista
PUT    /api/artistas/:id   # Actualizar artista
DELETE /api/artistas/:id   # Eliminar artista
```

### Museos

```
GET    /api/museos         # Todos los museos
GET    /api/museos/:id     # Un museo (con su colección)
POST   /api/museos         # Crear museo
PUT    /api/museos/:id     # Actualizar museo
DELETE /api/museos/:id     # Eliminar museo
```

## 🗂️ Estructura de Datos en Redis

Los datos se almacenan con claves prefijadas:

```
pintura:ID    → Datos de la pintura
artista:ID    → Datos del artista
museo:ID      → Datos del museo
usuario:ID    → Datos del usuario
```

Ejemplo de clave:
```
pintura:mona-lisa
artista:leonardo-da-vinci
museo:louvre
usuario:admin
```

## 🚀 Despliegue en Netlify

### Opción 1: Desde GitHub

1. Sube el proyecto a GitHub
2. Conecta con Netlify
3. Configuración:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Functions directory: `netlify/functions`
4. Configura variables de entorno:
   - `REDIS_URL`
   - `JWT_SECRET`

### Opción 2: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Compilar frontend
cd frontend && npm run build && cd ..

# Configurar variables
netlify env:set REDIS_URL "tu-redis-url"
netlify env:set JWT_SECRET "tu-secret"

# Deploy
netlify deploy --prod
```

## 📁 Estructura del Proyecto

```
proyecto3-pinturas-redis/
├── netlify/
│   └── functions/
│       ├── redis-client.js      # Cliente Redis
│       ├── utils.js              # Utilidades JWT y HTTP
│       ├── auth-login.js         # Login
│       ├── auth-register.js      # Registro
│       ├── auth-me.js            # Verificar token
│       ├── pinturas.js           # CRUD pinturas
│       ├── artistas.js           # CRUD artistas
│       └── museos.js             # CRUD museos
├── frontend/                     # Frontend Vue.js
│   ├── src/
│   │   ├── views/               # Páginas
│   │   ├── components/          # Componentes
│   │   ├── router/              # Vue Router
│   │   ├── stores/              # Pinia stores
│   │   └── api/                 # Axios config
│   └── package.json
├── scripts/
│   ├── seed-data.js             # Cargar datos
│   └── seed-users.js            # Cargar usuarios
├── package.json
├── netlify.toml
└── README.md
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor local

# Datos
npm run seed               # Cargar pinturas, artistas, museos
npm run seed-users         # Cargar usuarios

# Build
npm run build              # Compilar frontend

# Netlify
netlify dev                # Servidor local con Netlify
netlify deploy --prod      # Deploy a producción
```

## 🐛 Solución de Problemas

### Error de conexión a Redis

- Verifica que la URL de Redis sea correcta
- Asegúrate de que Redis.com permita conexiones externas
- Revisa que el puerto y password sean correctos

### Frontend no carga

- Ejecuta `cd frontend && npm run build`
- Verifica que `frontend/dist` tenga archivos
- Reinicia el servidor

### Funciones no responden

- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Netlify → Functions tab
- Asegúrate de que el token JWT sea válido

## 📝 Notas Importantes

1. **Redis.com Free Tier**: 30MB de almacenamiento, suficiente para este proyecto
2. **Claves en Redis**: Usa prefijos (`pintura:`, `artista:`, `museo:`) para organizar datos
3. **Sin RabbitMQ**: A diferencia del Proyecto 2, las operaciones son directas a Redis
4. **Mismo Frontend**: Reutiliza el frontend del Proyecto 2 sin cambios

## 📄 Licencia

Proyecto académico - Universidad Nacional de Costa Rica

## 👨‍💻 Autor

Proyecto 3 - Sistemas Distribuidos 2
