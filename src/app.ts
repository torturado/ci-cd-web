export function greet(name: string): string {
  return `Hola ${name}`;
}

// Manejar la carga de la imagen y ocultar el skeleton
function handleImageLoad(): void {
  const image = document.getElementById('main-image') as HTMLImageElement;
  const skeleton = document.getElementById('image-skeleton');
  
  if (image && skeleton) {
    image.classList.remove('opacity-0');
    image.classList.add('opacity-100');
    skeleton.classList.add('hidden');
  }
}

// Inicializar cuando el DOM esté listo
function initImageLoader(): void {
  const image = document.getElementById('main-image') as HTMLImageElement;
  if (image) {
    // Si la imagen ya está cargada
    if (image.complete && image.naturalHeight !== 0) {
      handleImageLoad();
    } else {
      // Esperar a que la imagen cargue
      image.addEventListener('load', handleImageLoad);
      image.addEventListener('error', () => {
        // Por si falla la carga, al menos ocultamos el skeleton
        const skeleton = document.getElementById('image-skeleton');
        if (skeleton) {
          skeleton.classList.add('hidden');
        }
      });
    }
  }
}

// Ejecutar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageLoader);
  } else {
    // El DOM ya está listo
    initImageLoader();
  }
}

console.log(greet("ASIX"));