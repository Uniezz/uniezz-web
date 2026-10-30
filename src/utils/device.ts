// shortcut: device detection is heuristic; replace when a platform capability signal is available.
export function isMobileDevice(userAgent: string, platform: string, touchPoints: number): boolean {
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ||
    (platform === 'MacIntel' && touchPoints > 1)
  );
}
export function shouldBlockMobile(mobile: boolean, narrow: boolean): boolean {
  return mobile && narrow;
}
