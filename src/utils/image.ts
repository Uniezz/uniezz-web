export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Invalid image data'));
        return;
      }
      const data = reader.result;
      const image = new Image();
      image.onerror = () => reject(new Error('Invalid image data'));
      image.onload = () => resolve(data);
      image.src = data;
    };
    reader.readAsDataURL(file);
  });
}

export function hasDuplicateImages(existing: string[], added: string[]): boolean {
  const images = new Set(existing.map((image) => image.slice(image.indexOf(',') + 1)));
  for (const image of added) {
    const data = image.slice(image.indexOf(',') + 1);
    if (images.has(data)) return true;
    images.add(data);
  }
  return false;
}
