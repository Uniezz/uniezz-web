/** Hold Poland, pan to Lublin, then zoom in and leave time to explore. */
export function landingMapCamera(progress: number): { center: [number, number]; zoom: number } {
  const pan = Math.min(1, Math.max(0, (progress - 0.15) / 0.3));
  const zoom = Math.min(1, Math.max(0, (progress - 0.35) / 0.5));
  const panEase = pan * pan * (3 - 2 * pan);
  const zoomEase = zoom * zoom * (3 - 2 * zoom);
  return {
    center: [19.1 + (22.565 - 19.1) * panEase, 52.1 + (51.25 - 52.1) * panEase],
    zoom: 5.3 + (12.2 - 5.3) * zoomEase,
  };
}

/** Find the scroll position that matches a cluster's expansion zoom. */
export function landingMapProgressForZoom(zoom: number): number {
  if (zoom <= landingMapCamera(0).zoom) return 0;
  if (zoom >= landingMapCamera(1).zoom) return 1;
  let low = 0.35;
  let high = 0.85;
  for (let i = 0; i < 20; i++) {
    const middle = (low + high) / 2;
    if (landingMapCamera(middle).zoom < zoom) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}
