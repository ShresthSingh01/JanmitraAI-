import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VARANASI_WARD_CENTROIDS, LUCKNOW_WARD_CENTROIDS } from '../utils/fallbackParser';

const CONSTITUENCY_CENTERS = {
  varanasi: { lat: 25.3176, lng: 82.9739, zoom: 13, name: "Varanasi (UP-77)" },
  lucknow: { lat: 26.8467, lng: 80.9462, zoom: 12, name: "Lucknow (UP-35)" }
};

// Custom SVG DivIcon generator for Leaflet
function createClusterIcon(cluster, isSelected, isHovered) {
  const isCritical = cluster.urgency === 'critical' || (cluster.priority_score && cluster.priority_score > 0.6);
  const isModerate = !isCritical && (cluster.priority_score > 0.4 || cluster.urgency === 'moderate');
  
  const color = isCritical ? '#ef4444' : isModerate ? '#f97316' : '#0ea5e9';
  const glowColor = isCritical ? 'rgba(239, 68, 68, 0.4)' : isModerate ? 'rgba(249, 115, 22, 0.4)' : 'rgba(14, 165, 233, 0.4)';
  const size = isSelected ? 34 : isHovered ? 30 : 24;

  const html = `
    <div class="custom-leaflet-marker ${isSelected ? 'selected' : ''}" style="width: ${size}px; height: ${size}px; position: relative; cursor: pointer;">
      ${isCritical ? `<div class="marker-pulse" style="background: ${color};"></div>` : ''}
      <div class="marker-core" style="
        background: ${color}; 
        box-shadow: 0 0 ${isSelected ? '14px' : '8px'} ${glowColor}, 0 2px 6px rgba(0,0,0,0.6);
        border: ${isSelected ? '3px solid #ffffff' : '2px solid #0f172a'};
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        font-size: ${size > 28 ? '11px' : '9px'};
        font-family: monospace;
        transition: transform 0.2s ease;
      ">
        ${cluster.complaint_count || '1'}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4]
  });
}

export default function MapPanel({
  clusters = [],
  selectedCluster,
  hoveredCluster,
  onSelectCluster,
  onSelectWard,
  currentConstituency = 'varanasi'
}) {
  const { t } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const selectedMarkerRef = useRef(null);

  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'
  const [geoData, setGeoData] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const constituencyConfig = CONSTITUENCY_CENTERS[currentConstituency.toLowerCase()] || CONSTITUENCY_CENTERS.varanasi;
  const wardMap = currentConstituency.toLowerCase() === 'lucknow' ? LUCKNOW_WARD_CENTROIDS : VARANASI_WARD_CENTROIDS;

  // 1. Load GeoJSON ward boundaries with real multi-vertex polygons
  useEffect(() => {
    const geoFile = currentConstituency.toLowerCase() === 'lucknow'
      ? '/constituencies/lucknow.geojson'
      : '/constituencies/varanasi.geojson';

    fetch(geoFile)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setGeoData(data))
      .catch(err => {
        console.warn("Falling back to root wards.geojson:", err.message);
        fetch('/wards.geojson')
          .then(r => r.json())
          .then(d => setGeoData(d))
          .catch(e => console.error("Error loading fallback geojson:", e));
      });
  }, [currentConstituency]);

  // 2. Initialize Leaflet Map Instance (100% Free, Zero API Key)
  useEffect(() => {
    if (!mapContainerRef.current || viewMode !== 'map') return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [constituencyConfig.lat, constituencyConfig.lng],
        zoom: constituencyConfig.zoom,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      // Primary: CartoDB Dark Matter tiles (100% free, no API key required)
      const primaryTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      });

      // Automatic fallback to standard OpenStreetMap tiles if Carto experiences any connectivity issue
      primaryTileLayer.on('tileerror', function() {
        if (!map._hasOsmFallback) {
          map._hasOsmFallback = true;
          console.info("Switched to secondary OpenStreetMap tile fallback.");
          const osmFallback = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          });
          osmFallback.addTo(map);
        }
      });

      primaryTileLayer.addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer groups
      geoJsonLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Invalidate size to ensure container renders correctly
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        geoJsonLayerRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [viewMode, constituencyConfig]);

  // 3. Render GeoJSON Ward Polygons & Auto-fit bounds
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current || !geoData) return;

    geoJsonLayerRef.current.clearLayers();

    const geoLayer = L.geoJSON(geoData, {
      style: (feature) => {
        const wardId = feature?.properties?.ward;
        const isWardSelected = selectedCluster && selectedCluster.ward === wardId;
        return {
          fillColor: isWardSelected ? '#38bdf8' : '#0284c7',
          fillOpacity: isWardSelected ? 0.38 : 0.14,
          color: isWardSelected ? '#38bdf8' : '#0ea5e9',
          weight: isWardSelected ? 2.5 : 1.2,
          dashArray: isWardSelected ? null : '3, 4',
          opacity: 0.85
        };
      },
      onEachFeature: (feature, layer) => {
        const wardId = feature?.properties?.ward || 'Ward';
        const wardName = feature?.properties?.ward_name || feature?.properties?.name || wardId;
        const pop = feature?.properties?.population ? Number(feature.properties.population).toLocaleString() : null;

        // Custom tooltip
        layer.bindTooltip(
          `<div class="text-[11px] font-mono">
            <strong>${wardId}</strong>: ${wardName}
            ${pop ? `<br/><span class="text-slate-400">Pop: ${pop}</span>` : ''}
           </div>`,
          { className: 'leaflet-dark-tooltip', sticky: true }
        );

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              fillOpacity: 0.32,
              weight: 2,
              color: '#38bdf8'
            });
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
          },
          click: () => {
            if (onSelectWard && wardId) onSelectWard(wardId);
            const matchingCluster = clusters.find(c => c.ward === wardId);
            if (matchingCluster && onSelectCluster) {
              onSelectCluster(matchingCluster);
            }
          }
        });
      }
    });

    geoJsonLayerRef.current.addLayer(geoLayer);

    // Dynamically fit map bounds to the exact boundaries of the constituency
    try {
      const bounds = geoLayer.getBounds();
      if (bounds.isValid() && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [24, 24],
          maxZoom: 14,
          animate: true,
          duration: 0.8
        });
      }
    } catch (e) {
      console.warn("fitBounds fallback to flyTo:", e);
      mapInstanceRef.current.flyTo(
        [constituencyConfig.lat, constituencyConfig.lng],
        constituencyConfig.zoom,
        { duration: 0.8 }
      );
    }
  }, [geoData, clusters, selectedCluster, constituencyConfig, onSelectWard, onSelectCluster, mapLoaded]);

  // 4. Render Cluster Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    selectedMarkerRef.current = null;

    clusters.forEach((cluster) => {
      // Resolve position from location or ward centroid
      let lat = cluster.location?.lat;
      let lng = cluster.location?.lng;

      if (!lat || !lng || lat > 28 || lat < 24) {
        const wardInfo = wardMap[cluster.ward] || wardMap[Object.keys(wardMap)[0]];
        if (wardInfo) {
          const jitterLat = (Math.abs(cluster.id?.charCodeAt(3) || 0) % 5) * 0.001 - 0.002;
          const jitterLng = (Math.abs(cluster.id?.charCodeAt(5) || 0) % 5) * 0.001 - 0.002;
          lat = wardInfo.lat + jitterLat;
          lng = wardInfo.lng + jitterLng;
        } else {
          lat = constituencyConfig.lat;
          lng = constituencyConfig.lng;
        }
      }

      const isSelected = selectedCluster?.id === cluster.id;
      const isHovered = hoveredCluster?.id === cluster.id;
      const icon = createClusterIcon(cluster, isSelected, isHovered);

      const marker = L.marker([lat, lng], { icon });

      // Popup content with dark theme styling
      const costLakhs = cluster.estimated_cost_inr ? (cluster.estimated_cost_inr / 100000).toFixed(1) : "N/A";
      const score = cluster.priority_score ? cluster.priority_score.toFixed(3) : "0.000";
      const pop = cluster.affected_population ? Number(cluster.affected_population).toLocaleString() : "N/A";
      const isUrgent = cluster.urgency === 'critical' || cluster.priority_score > 0.5;

      const popupHtml = `
        <div class="leaflet-popup-card">
          <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-700">
            <span class="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">${cluster.ward || 'Constituency'}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/20 text-sky-400'}">
              ${t('map.score', 'SCORE')}: ${score}
            </span>
          </div>
          <h4 class="text-xs font-bold text-white capitalize mb-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-sky-400'}"></span>
            ${cluster.issue_type} ${t('map.deficit', 'Deficit')}
          </h4>
          <p class="text-[11px] text-slate-300 mb-2 leading-relaxed line-clamp-2">
            ${cluster.description || 'Civic infrastructure upgrade project'}
          </p>
          <div class="grid grid-cols-2 gap-1.5 mb-2.5 text-[10px] bg-slate-900/80 p-1.5 rounded border border-slate-800">
            <div>
              <span class="text-slate-400 block font-mono">${t('map.affected', 'Affected')}</span>
              <strong class="text-slate-200">${pop}</strong>
            </div>
            <div>
              <span class="text-slate-400 block font-mono">${t('map.est_cost', 'Est. Cost')}</span>
              <strong class="text-emerald-400">₹${costLakhs}L</strong>
            </div>
          </div>
          <button 
            id="btn-inspect-${cluster.id}" 
            class="w-full py-1.5 px-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            ${t('map.inspect_project', 'Inspect Project Docket →')}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'leaflet-dark-popup',
        maxWidth: 260
      });

      marker.on('click', () => {
        if (onSelectCluster) onSelectCluster(cluster);
        if (onSelectWard && cluster.ward) onSelectWard(cluster.ward);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${cluster.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectCluster) onSelectCluster(cluster);
            marker.closePopup();
          };
        }
      });

      if (isSelected) {
        selectedMarkerRef.current = marker;
      }

      markersLayerRef.current.addLayer(marker);
    });

    // Fly to selected cluster if changed
    if (selectedCluster && mapInstanceRef.current) {
      let sLat = selectedCluster.location?.lat;
      let sLng = selectedCluster.location?.lng;
      if (!sLat || !sLng) {
        const info = wardMap[selectedCluster.ward] || constituencyConfig;
        sLat = info.lat;
        sLng = info.lng;
      }
      mapInstanceRef.current.flyTo([sLat, sLng], 14, { duration: 0.8 });
    }
  }, [clusters, selectedCluster, hoveredCluster, constituencyConfig, wardMap, onSelectCluster, onSelectWard, mapLoaded, t]);

  // Reset map view to constituency bounds
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      if (geoJsonLayerRef.current && geoJsonLayerRef.current.getLayers().length > 0) {
        try {
          const firstLayer = geoJsonLayerRef.current.getLayers()[0];
          if (firstLayer && firstLayer.getBounds && firstLayer.getBounds().isValid()) {
            mapInstanceRef.current.fitBounds(firstLayer.getBounds(), { padding: [24, 24], maxZoom: 14 });
            return;
          }
        } catch (e) {
          console.warn("Reset fitBounds fallback:", e);
        }
      }
      mapInstanceRef.current.flyTo(
        [constituencyConfig.lat, constituencyConfig.lng],
        constituencyConfig.zoom,
        { duration: 0.6 }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-950 overflow-hidden flex flex-col rounded-xl border border-slate-800">
      {/* Map Control Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xs z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
            {constituencyConfig.name} {t('map.gis_intelligence', 'GIS INTELLIGENCE')}
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
            {t('map.osm_leaflet', 'OpenStreetMap / Leaflet (Zero API Key)')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {viewMode === 'map' && (
            <button
              onClick={handleResetView}
              title={t('map.reset_view', 'Reset View')}
              className="text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              {t('map.reset_view', 'Reset View')}
            </button>
          )}

          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
            className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {viewMode === 'map' ? t('map.ward_grid', 'Ward Grid') : t('map.map_canvas', 'Map Canvas')}
          </button>
        </div>
      </div>

      {/* Map Canvas / Grid Container */}
      <div className="flex-1 relative w-full h-full min-h-[300px] overflow-hidden">
        {viewMode === 'map' ? (
          <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />
        ) : (
          /* Ward Grid Overview */
          <div className="p-3.5 overflow-y-auto h-full bg-slate-950">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {Object.entries(wardMap).map(([wardId, info]) => {
                const wardClusters = clusters.filter(c => c.ward === wardId);
                const hasCritical = wardClusters.some(c => c.urgency === 'critical' || c.priority_score > 0.6);
                const isSelected = selectedCluster && selectedCluster.ward === wardId;

                return (
                  <button
                    key={wardId}
                    onClick={() => {
                      if (onSelectWard) onSelectWard(wardId);
                      if (wardClusters.length > 0 && onSelectCluster) onSelectCluster(wardClusters[0]);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/90 border-sky-400 shadow-lg shadow-sky-900/30'
                        : hasCritical
                        ? 'bg-red-950/20 border-red-900/60 hover:border-red-600'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{wardId}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hasCritical ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {wardClusters.length} {wardClusters.length === 1 ? 'cluster' : 'clusters'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mb-1.5">{info.name || wardId}</p>
                    <div className="flex flex-wrap gap-1">
                      {wardClusters.map(c => (
                        <span
                          key={c.id}
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono ${
                            c.issue_type === 'water' ? 'bg-blue-900/60 text-blue-300' :
                            c.issue_type === 'health' ? 'bg-emerald-900/60 text-emerald-300' :
                            c.issue_type === 'road' ? 'bg-amber-900/60 text-amber-300' :
                            'bg-purple-900/60 text-purple-300'
                          }`}
                        >
                          {c.issue_type}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Map Legend (when in map view) */}
        {viewMode === 'map' && (
          <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-xs shadow-lg text-[10px] font-mono text-slate-300 flex flex-col gap-1.5 pointer-events-auto">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
              {t('map.severity_title', 'GIS Cluster Severity')}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{t('map.critical_need', 'Critical Need (>0.6)')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>{t('map.moderate_priority', 'Moderate Priority')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>{t('map.standard_baseline', 'Standard Baseline')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Embedded CSS for custom Leaflet markers, pulse effect, and popups */}
      <style>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .marker-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          opacity: 0.6;
          animation: markerPulseAnimation 1.8s infinite ease-out;
        }
        @keyframes markerPulseAnimation {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .custom-leaflet-marker.selected .marker-core {
          transform: scale(1.15);
        }
        .leaflet-dark-popup .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
          border-radius: 10px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7) !important;
          padding: 2px !important;
        }
        .leaflet-dark-popup .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
        }
        .leaflet-dark-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 6px !important;
        }
        .leaflet-dark-popup .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
        .leaflet-dark-tooltip {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-dark-tooltip::before {
          border-top-color: #0f172a !important;
        }
      `}</style>
    </div>
  );
}
