// Manejar la carga de la imagen y ocultar el skeleton
function showImage(image: HTMLImageElement, skeleton: HTMLElement) {
  image.classList.remove('opacity-0');
  image.classList.add('opacity-100');
  skeleton.classList.add('hidden');
}

// Inicializar cuando el DOM esté listo
export function initImageLoader(): void {
  const image = document.getElementById('main-image') as HTMLImageElement;
  const skeleton = document.getElementById('image-skeleton');
  
  if (image && skeleton) {
    // Si la imagen ya está cargada
    if (image.complete && image.naturalHeight !== 0) {
      showImage(image, skeleton);
    } else {
      // Esperar a que la imagen cargue
      image.addEventListener('load', () => showImage(image, skeleton), { once: true });
      image.addEventListener('error', () => {
        // Por si falla la carga, al menos ocultamos el skeleton
        skeleton.classList.add('hidden');
      }, { once: true });
    }
  }
}