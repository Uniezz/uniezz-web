import {
  type CircleLayerSpecification,
  type LineLayerSpecification,
  type SymbolLayerSpecification,
} from '@vis.gl/react-maplibre';
import type { MapLibreMap } from 'maplibre-gl';
import { type Campus } from '@/@types';
import type { University } from '@/@types/auth';

export const SOURCE_ID = 'campus-locations';
export const CLUSTER_LAYER_ID = 'campus-clusters';
const CAMPUS_LAYER_ID = 'campus-logos';
export const LOGO_PREFIX = 'university-logo:';
// Drawn at 2x pixel ratio, so 72px renders as a 36px badge.
const LOGO_SIZE = 72;
// Keeps the square logo inside the circle: its corners stay within the radius.
const LOGO_INSET = 12;
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';
export const INTERACTIVE_LAYER_IDS = [CLUSTER_LAYER_ID, CAMPUS_LAYER_ID];

export const CLUSTER_LAYER: CircleLayerSpecification = {
  id: CLUSTER_LAYER_ID,
  type: 'circle',
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#5B7CFF',
    'circle-radius': ['step', ['get', 'point_count'], 19, 10, 23, 30, 28],
    'circle-stroke-color': '#DCE6FF',
    'circle-stroke-width': 2,
  },
};
export const CLUSTER_COUNT_LAYER: SymbolLayerSpecification = {
  id: 'campus-cluster-count',
  type: 'symbol',
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['Noto Sans Regular'],
    'text-size': 13,
  },
  paint: { 'text-color': '#FFFFFF' },
};
export const CAMPUS_LAYER: SymbolLayerSpecification = {
  id: CAMPUS_LAYER_ID,
  type: 'symbol',
  source: SOURCE_ID,
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': ['get', 'icon'],
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
  },
};

export const POLAND_BORDER_LAYER: LineLayerSpecification = {
  id: 'poland-border',
  type: 'line',
  // The base style's own vector source, so the border costs no extra download.
  source: 'openmaptiles',
  'source-layer': 'boundary',
  filter: [
    'all',
    ['==', ['get', 'admin_level'], 2],
    ['any', ['==', ['get', 'adm0_l'], 'POL'], ['==', ['get', 'adm0_r'], 'POL']],
  ],
  paint: { 'line-color': '#FFFFFF', 'line-width': 1.5, 'line-opacity': 0.8 },
};

// Loads a university logo the first time the campus layer asks for it, drawn as a white round badge.
export async function addUniversityLogo(map: MapLibreMap, id: string) {
  if (!id.startsWith(LOGO_PREFIX)) return;
  const response = await fetch(`/universities/${id.slice(LOGO_PREFIX.length)}.png`);
  if (!response.ok) return;
  const logo = await createImageBitmap(await response.blob());
  const context = new OffscreenCanvas(LOGO_SIZE, LOGO_SIZE).getContext('2d');
  if (!context || map.hasImage(id)) return;
  const radius = LOGO_SIZE / 2;
  context.fillStyle = '#FFFFFF';
  context.arc(radius, radius, radius, 0, Math.PI * 2);
  context.fill();
  context.clip();
  context.drawImage(
    logo,
    LOGO_INSET,
    LOGO_INSET,
    LOGO_SIZE - LOGO_INSET * 2,
    LOGO_SIZE - LOGO_INSET * 2,
  );
  map.addImage(id, context.getImageData(0, 0, LOGO_SIZE, LOGO_SIZE), { pixelRatio: 2 });
}

// One campus per university building: faculties sharing coordinates are merged.
export function groupCampuses(universities: University[]) {
  const byLocation = new Map<string, Campus>();
  for (const university of universities) {
    for (const { name, address, location } of university.faculties ?? []) {
      const key = `${university.id}:${location.longitude}:${location.latitude}`;
      const campus = byLocation.get(key);
      if (campus) campus.facultyNames.push(name);
      else {
        byLocation.set(key, {
          universityId: university.id,
          universityName: university.name,
          address,
          longitude: location.longitude,
          latitude: location.latitude,
          facultyNames: [name],
        });
      }
    }
  }
  return [...byLocation.values()];
}
