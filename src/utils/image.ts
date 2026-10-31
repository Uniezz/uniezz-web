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
