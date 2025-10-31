# Configuración de Spotify Widget

Este widget muestra la canción que estás reproduciendo actualmente en Spotify, o "Listening Silence" cuando no hay nada reproduciéndose.

## Pasos para configurar

### 1. Crear una aplicación en Spotify

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create app"
4. Completa el formulario:
   - **App name**: El nombre que quieras (ej: "My Website Widget")
   - **App description**: Descripción opcional
   - **Redirect URI**: `http://localhost:4321/ci-cd-web/api/spotify/callback` (para desarrollo) o tu URL de producción
   - **Website**: Tu URL del sitio web
   - Marca "I understand and agree..."
5. Haz clic en "Save"

### 2. Obtener Client ID y Client Secret

1. En el dashboard de tu aplicación, verás tu **Client ID**
2. Haz clic en "View client secret" para revelar tu **Client Secret**
3. Copia ambos valores

### 3. Obtener Refresh Token

El refresh token te permite obtener tokens de acceso sin necesidad de autenticación manual cada vez.

#### Opción A: Usando un script de Node.js

Crea un archivo `get-spotify-token.js` en la raíz del proyecto:

```javascript
import fetch from 'node-fetch';

const CLIENT_ID = 'tu_client_id';
const CLIENT_SECRET = 'tu_client_secret';
const REDIRECT_URI = 'http://localhost:4321/ci-cd-web/api/spotify/callback';

// Paso 1: Obtener authorization code
const scopes = 'user-read-currently-playing user-read-playback-state';
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;

console.log('1. Visita esta URL y autoriza la aplicación:');
console.log(authUrl);
console.log('\n2. Después de autorizar, serás redirigido a una URL con un parámetro "code"');
console.log('3. Copia ese código y ejecuta el script con: node get-spotify-token.js <code>');
```

Luego, usa el código de autorización para obtener el refresh token:

```javascript
// Continuación del script
const authCode = process.argv[2];

if (!authCode) {
  console.error('Por favor, proporciona el código de autorización');
  process.exit(1);
}

const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI
  })
});

const tokenData = await tokenResponse.json();
console.log('\nRefresh Token:', tokenData.refresh_token);
```

#### Opción B: Usando herramientas online

Puedes usar herramientas como [Spotify Token Generator](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#request-an-access-token) o seguir la guía oficial de Spotify.

### 4. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (copia de `.env.example`)
2. Añade tus credenciales:

```
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
SPOTIFY_REFRESH_TOKEN=tu_refresh_token_aqui
```

### 5. ¡Listo!

Ahora el widget debería funcionar. Asegúrate de tener Spotify abierto y reproduciendo música para ver tu canción actual.

## Notas

- El widget se actualiza cada 2 segundos
- Si no estás reproduciendo nada, mostrará "Listening Silence"
- El refresh token expira después de un tiempo. Si deja de funcionar, obtén uno nuevo siguiendo los pasos anteriores
- Asegúrate de que las variables de entorno estén configuradas antes de hacer build/deploy

