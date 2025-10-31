import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const baseUrl = url.origin;

  // Obtener el código de autorización de la URL
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(
      `Error de autorización: ${error}. <a href="/ci-cd-web">Volver</a>`,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  if (!code) {
    // Si no hay código, redirigir a la página de autorización
    const scopes = 'user-read-currently-playing user-read-playback-state';
    const redirectUri = `${baseUrl}/ci-cd-web/api/spotify/callback`;
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl
      }
    });
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return new Response(
      'Spotify credentials not configured. <a href="/ci-cd-web">Volver</a>',
      {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }

  try {
    // Intercambiar código por tokens
    const redirectUri = `${baseUrl}/ci-cd-web/api/spotify/callback`;
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      return new Response(
        `Error al obtener tokens: ${tokenResponse.status} ${errorData}. <a href="/ci-cd-web">Volver</a>`,
        {
          status: tokenResponse.status,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    const tokenData = await tokenResponse.json();

    // Mostrar el refresh token para que el usuario lo copie
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Spotify Token</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #151515;
            color: #fff;
          }
          .token-box {
            background: #1db954;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            word-break: break-all;
          }
          code {
            background: rgba(0,0,0,0.3);
            padding: 2px 6px;
            border-radius: 3px;
          }
          .instructions {
            background: #333;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          a {
            color: #1db954;
          }
        </style>
      </head>
      <body>
        <h1>✅ Autorización exitosa</h1>
        <div class="instructions">
          <h2>Instrucciones:</h2>
          <ol>
            <li>Copia el <strong>Refresh Token</strong> de abajo</li>
            <li>Añádelo a tu archivo <code>.env</code> como:</li>
            <pre>SPOTIFY_REFRESH_TOKEN=tu_refresh_token_aqui</pre>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
        </div>
        
        <div class="token-box">
          <strong>Refresh Token:</strong><br>
          <code style="font-size: 14px;">${tokenData.refresh_token}</code>
        </div>
        
        <p><strong>Access Token:</strong> (se refresca automáticamente)</p>
        <p><code style="font-size: 12px; opacity: 0.7;">${tokenData.access_token?.substring(0, 50)}...</code></p>
        
        <p><a href="/ci-cd-web">← Volver a la página principal</a></p>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}. <a href="/ci-cd-web">Volver</a>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
};

