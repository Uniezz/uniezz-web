import { describe, expect, test } from 'bun:test';
import { landingMapCamera, landingMapProgressForZoom } from '../../src/utils/landingMap';

describe('landing map camera', () => {
  test('starts over Poland and ends over Lublin', () => {
    expect(landingMapCamera(0)).toEqual({ center: [19.1, 52.1], zoom: 5.3 });
    const end = landingMapCamera(1);
    expect(end.center).toEqual([22.565, 51.25]);
    expect(end.zoom).toBeCloseTo(12.2);
  });
  test('holds the country view before travelling and pauses on arrival', () => {
    expect(landingMapCamera(0.15)).toEqual(landingMapCamera(0));
    expect(landingMapCamera(0.85)).toEqual(landingMapCamera(1));
  });
  test('centers Lublin before the close-up', () => {
    expect(landingMapCamera(0.45).center).toEqual(landingMapCamera(1).center);
    expect(landingMapCamera(0.45).zoom).toBeLessThan(7);
  });
  test('clamps overscroll and retraces the same camera when scrolling back', () => {
    expect(landingMapCamera(-1)).toEqual(landingMapCamera(0));
    expect(landingMapCamera(2)).toEqual(landingMapCamera(1));
    const forward = [0, 0.25, 0.5, 0.75, 1].map(landingMapCamera);
    expect([1, 0.75, 0.5, 0.25, 0].map(landingMapCamera)).toEqual([...forward].reverse());
    expect(forward.every((camera, i) => i === 0 || camera.zoom >= forward[i - 1].zoom)).toBe(true);
  });
  test('maps cluster zoom to matching scroll progress', () => {
    expect(landingMapProgressForZoom(4)).toBe(0);
    expect(landingMapProgressForZoom(15)).toBe(1);
    const zooms = [6, 8, 10, 11, 12];
    const progress = zooms.map(landingMapProgressForZoom);
    for (let i = 0; i < zooms.length; i++) {
      expect(landingMapCamera(progress[i]).zoom).toBeCloseTo(zooms[i], 4);
      if (i > 0) expect(progress[i]).toBeGreaterThan(progress[i - 1]);
    }
  });
});
