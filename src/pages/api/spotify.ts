import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REFRESH_TOKEN = import.meta.env.SPOTIFY_REFRESH_TOKEN;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return new Response(
      JSON.stringify({ 
        error: 'Spotify credentials not configured',
        isPlaying: false,
        track: null 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Obtener access token usando refresh token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error response:', tokenResponse.status, errorText);
      throw new Error(`Failed to get access token: ${tokenResponse.status} - ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Obtener estado actual de reproducción
    const playbackResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (playbackResponse.status === 204 || !playbackResponse.ok) {
      // No hay nada reproduciéndose
      return new Response(
        JSON.stringify({
          isPlaying: false,
          track: null,
          message: 'Not currently playing'
        }),
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }

    const playbackData = await playbackResponse.json();

    if (!playbackData.item) {
      return new Response(
        JSON.stringify({
          isPlaying: false,
          track: null,
          message: 'No track data'
        }),
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }

    const track = {
      name: playbackData.item.name,
      artist: playbackData.item.artists.map((a: { name: string }) => a.name).join(', '),
      album: playbackData.item.album.name,
      image: playbackData.item.album.images[0]?.url || null,
      isPlaying: playbackData.is_playing,
      progressMs: playbackData.progress_ms,
      durationMs: playbackData.item.duration_ms
    };

    return new Response(
      JSON.stringify({
        isPlaying: track.isPlaying,
        track: track
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  } catch (error) {
    console.error('Spotify API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch Spotify data',
        isPlaying: false,
        track: null
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

