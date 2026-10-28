import Map, {
  Layer,
  Popup,
  Source,
  type MapEvent,
  type MapLayerMouseEvent,
  type MapRef,
} from '@vis.gl/react-maplibre';
import { type FeatureCollection, type Point } from 'geojson';
import { Minus, Plus, Search } from 'lucide-react';
import type { GeoJSONSource } from 'maplibre-gl';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { type Campus, type CampusProperties } from '@/@types';
import type { University } from '@/@types/auth';
import {
  addUniversityLogo,
  CAMPUS_LAYER,
  CLUSTER_COUNT_LAYER,
  CLUSTER_LAYER,
  CLUSTER_LAYER_ID,
  groupCampuses,
  INTERACTIVE_LAYER_IDS,
  LOGO_PREFIX,
  MAP_STYLE,
  POLAND_BORDER_LAYER,
  SOURCE_ID,
} from '@/utils';

import 'maplibre-gl/dist/maplibre-gl.css';

export function UniversityMapCanvas({
  universities,
  isLoading,
  isError,
}: {
  universities: University[];
  isLoading: boolean;
  isError: boolean;
}) {
  const { t } = useTranslation();
  const mapRef = useRef<MapRef>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const campuses = useMemo(() => groupCampuses(universities), [universities]);
  const campusData = useMemo<FeatureCollection<Point, CampusProperties>>(
    () => ({
      type: 'FeatureCollection',
      features: campuses.map((campus, index) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [campus.longitude, campus.latitude] },
        properties: { index, icon: `${LOGO_PREFIX}${campus.universityId}` },
      })),
    }),
    [campuses],
  );
  const searchResults = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return [];
    return universities
      .filter((university) => {
        const haystack = [
          university.name,
          ...(university.faculties ?? []).flatMap((faculty) => [faculty.name, faculty.address]),
        ];
        return haystack.some((value) => value.toLocaleLowerCase().includes(query));
      })
      .slice(0, 5);
  }, [search, universities]);

  const onMapLoad = (event: MapEvent) => {
    const map = event.target;
    map.setMissingStyleImageResolver((id) => addUniversityLogo(map, id));
    // The logo layer mounts after the resolver is set, so no logo request is missed.
    setMapReady(true);
  };

  const onMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    if (feature.layer.id === CLUSTER_LAYER_ID) {
      const source = mapRef.current?.getSource<GeoJSONSource>(SOURCE_ID);
      const center = (feature.geometry as Point).coordinates as [number, number];
      void source?.getClusterExpansionZoom(feature.properties.cluster_id).then(
        (zoom) => mapRef.current?.easeTo({ center, zoom }),
        () => undefined,
      );
      return;
    }

    setSelectedCampus(campuses[Number(feature.properties?.index)] ?? null);
  };

  const focusUniversity = (university: University) => {
    const faculty = university.faculties?.[0];
    if (!faculty) return;
    mapRef.current?.flyTo({
      center: [faculty.location.longitude, faculty.location.latitude],
      zoom: 14,
      duration: 1000,
    });
    setSearch(university.name);
  };

  const status = isLoading
    ? t('landing.map.loading')
    : isError
      ? t('landing.map.unavailable')
      : mapFailed && !mapReady
        ? t('landing.map.mapUnavailable')
        : campuses.length === 0
          ? t('landing.map.empty')
          : null;

  return (
    <div className="relative mt-8 h-112 overflow-hidden rounded-sm bg-[#0c0d14] md:h-140">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 22.565, latitude: 51.25, zoom: 12 }}
        mapStyle={MAP_STYLE}
        // Below zoom 5 the tiles drop the country codes the Poland border filter needs.
        minZoom={5}
        maxZoom={15}
        workerUrl={workerUrl}
        interactiveLayerIds={INTERACTIVE_LAYER_IDS}
        onLoad={onMapLoad}
        onError={() => setMapFailed(true)}
        onClick={onMapClick}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Layer {...POLAND_BORDER_LAYER} />
        <Source
          id={SOURCE_ID}
          type="geojson"
          data={campusData}
          cluster
          clusterRadius={56}
          clusterMaxZoom={10}
        >
          <Layer {...CLUSTER_LAYER} />
          <Layer {...CLUSTER_COUNT_LAYER} />
          {mapReady ? <Layer {...CAMPUS_LAYER} /> : null}
        </Source>
        {selectedCampus ? (
          <Popup
            longitude={selectedCampus.longitude}
            latitude={selectedCampus.latitude}
            className="university-map-popup"
            offset={22}
            maxWidth="280px"
            onClose={() => setSelectedCampus(null)}
          >
            <p className="font-medium text-[#f2eee6]">{selectedCampus.universityName}</p>
            {selectedCampus.facultyNames.map((facultyName) => (
              <p key={facultyName} className="mt-1 text-sm text-white/80">
                {facultyName}
              </p>
            ))}
            <p className="mt-1 text-xs text-white/60">{selectedCampus.address}</p>
          </Popup>
        ) : null}
      </Map>

      <div className="absolute top-4 left-4 z-10 w-[min(360px,calc(100%-6rem))]">
        <label className="flex h-14 items-center gap-3 border border-white/15 bg-[#171922]/95 px-4 text-white/60 backdrop-blur-sm focus-within:border-[#a9baff]/70">
          <Search size={18} aria-hidden />
          <span className="sr-only">{t('landing.map.searchLabel')}</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('landing.map.searchPlaceholder')}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55"
          />
        </label>
        {search.trim() ? (
          <div
            role="listbox"
            aria-label={t('landing.map.searchLabel')}
            className="mt-2 max-h-56 overflow-auto border border-white/10 bg-[#171922]/95 py-1 shadow-xl backdrop-blur-sm"
          >
            {searchResults.length ? (
              searchResults.map((university) => (
                <button
                  key={university.id}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => focusUniversity(university)}
                  className="block w-full px-4 py-3 text-left text-sm text-white/85 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                >
                  {university.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-white/55">{t('landing.map.noResults')}</p>
            )}
          </div>
        ) : null}
      </div>

      <div className="absolute right-4 bottom-12 z-10 flex flex-col overflow-hidden border border-white/15 bg-[#171922]/95 backdrop-blur-sm">
        <button
          type="button"
          aria-label={t('landing.map.zoomIn')}
          onClick={() => mapRef.current?.zoomIn()}
          className="grid size-11 place-items-center text-[#f2eee6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#a9baff]"
        >
          <Plus size={16} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t('landing.map.zoomOut')}
          onClick={() => mapRef.current?.zoomOut()}
          className="grid size-11 place-items-center border-t border-white/10 text-[#f2eee6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#a9baff]"
        >
          <Minus size={16} aria-hidden />
        </button>
      </div>

      {status ? (
        <p
          role={isError ? 'alert' : 'status'}
          className="absolute bottom-4 left-4 z-10 border border-white/10 bg-[#171922]/95 px-3 py-2 text-xs text-white/75 backdrop-blur-sm"
        >
          {status}
        </p>
      ) : null}
    </div>
  );
}
