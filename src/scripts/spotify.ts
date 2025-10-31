interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  image: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}

interface SpotifyResponse {
  isPlaying: boolean;
  track: SpotifyTrack | null;
  error?: string;
}

export function initSpotifyWidget(): void {
  const title1El = document.getElementById('spotify-title-1');
  const title2El = document.getElementById('spotify-title-2');
  const playingEl = document.getElementById('spotify-playing');
  const elapsedEl = document.getElementById('spotify-elapsed');
  const timeNowEl = document.getElementById('spotify-time-now');
  const timeFullEl = document.getElementById('spotify-time-full');
  const pfpEl = document.getElementById('spotify-pfp');

  if (!title1El || !title2El || !playingEl || !elapsedEl || !timeNowEl || !timeFullEl) {
    console.error('Spotify widget elements not found');
    return;
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function updateWidget(data: SpotifyResponse): void {
    if (data.error || !data.track || !data.isPlaying) {
      // Mostrar "Listening Silence" cuando no hay reproducción
      if (title1El) title1El.textContent = 'Listening Silence';
      if (title2El) title2El.textContent = 'No music playing';
      if (playingEl) playingEl.classList.add('hidden');
      if (elapsedEl) elapsedEl.style.width = '0%';
      if (timeNowEl) timeNowEl.textContent = '0:00';
      if (timeFullEl) timeFullEl.textContent = '0:00';
      if (pfpEl) {
        pfpEl.style.backgroundImage = 'none';
        pfpEl.style.backgroundColor = '#d2d2d2';
      }
      return;
    }

    const track = data.track;

    // Actualizar texto
    if (title1El) title1El.textContent = track.name;
    if (title2El) title2El.textContent = track.artist;

    // Actualizar imagen del álbum
    if (pfpEl && track.image) {
      pfpEl.style.backgroundImage = `url(${track.image})`;
      pfpEl.style.backgroundSize = 'cover';
      pfpEl.style.backgroundPosition = 'center';
    }

    // Mostrar/ocultar animación de reproducción
    if (playingEl) {
      if (track.isPlaying) {
        playingEl.classList.remove('hidden');
      } else {
        playingEl.classList.add('hidden');
      }
    }

    // Actualizar barra de progreso
    const progress = (track.progressMs / track.durationMs) * 100;
    if (elapsedEl) elapsedEl.style.width = `${progress}%`;

    // Actualizar tiempos
    if (timeNowEl) timeNowEl.textContent = formatTime(track.progressMs);
    if (timeFullEl) timeFullEl.textContent = formatTime(track.durationMs);
  }

  async function fetchSpotifyData(): Promise<void> {
    try {
      // Determinar el base path desde la URL actual o usar el predeterminado
      const basePath = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL 
        ? import.meta.env.BASE_URL 
        : '/ci-cd-web/';
      const apiPath = `${basePath}api/spotify`.replace(/\/+/g, '/');
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: SpotifyResponse = await response.json();
      updateWidget(data);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      // Mostrar estado de silencio en caso de error
      updateWidget({ isPlaying: false, track: null });
    }
  }

  // Fetch inicial
  fetchSpotifyData();

  // Actualizar cada 2 segundos
  setInterval(fetchSpotifyData, 2000);
}

