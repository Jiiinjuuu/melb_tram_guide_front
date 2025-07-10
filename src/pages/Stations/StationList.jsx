// 트램별 정류장을 지도에 띄우는 역할
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const StationList = () => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const navigate = useNavigate();

  // 노선번호별 아이콘 URL 지정 함수
  const getTramIconByLine = (line) => {
    return L.icon({
      iconUrl: `/img/${line}.png`, // 예: /img/35.png
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });
  };

  // 스탬프 명소 아이콘
  const stampIcon = L.icon({
    iconUrl: '/img/stamp_pin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });

  useEffect(() => {
    // 지도 초기화
    leafletMapRef.current = L.map(mapRef.current).setView([-37.8136, 144.9631], 14);

    // 타일 레이어
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMapRef.current);

    // 정류장 마커 + 노선 경로
    axios.get('http://localhost/melb_tram_api/public/getStations_map.php')
      .then(response => {
        const stationsByLine = {};

        response.data.forEach(station => {
          if (station.latitude && station.longitude) {
            const line = station.line || 'default';

            // 노선별 정류장 위치 수집
            if (!stationsByLine[line]) stationsByLine[line] = [];
            stationsByLine[line].push({
              lat: parseFloat(station.latitude),
              lng: parseFloat(station.longitude)
            });

            // 정류장 마커 표시
            const icon = getTramIconByLine(line);
            const marker = L.marker([station.latitude, station.longitude], {
              icon: icon
            }).addTo(leafletMapRef.current);

            marker.bindTooltip(`<strong>${station.name}</strong><br>${station.description}`);
            marker.on('click', () => {
              navigate(`/places_on_map/${station.id}`);
            });
          }
        });

        // 노선별 폴리라인 경로 표시
        Object.entries(stationsByLine).forEach(([line, coords]) => {
          const colorMap = {
            '35': 'red',
            '96': 'blue',
            '86': 'gold',
            'default': 'gray'
          };
          const color = colorMap[line] || 'black';

          L.polyline(coords, {
            color,
            weight: 4
          }).addTo(leafletMapRef.current);
        });
      })
      .catch(error => {
        console.error('정류장 데이터 로딩 실패:', error);
      });

    // 스탬프 명소 마커 표시
    axios.get('http://localhost/melb_tram_api/public/getStampPlaces.php')
      .then(response => {
        response.data.forEach(place => {
          if (place.latitude && place.longitude) {
            const marker = L.marker([place.latitude, place.longitude], {
              icon: stampIcon
            }).addTo(leafletMapRef.current);

            marker.bindTooltip(
              `<strong>${place.name}</strong><br>${place.description}<br>🎖 스탬프 명소`,
              {
                direction: 'top',
                offset: [0, -20],
                opacity: 1,
              }
            );
          }
        });
      })
      .catch(error => {
        console.error('스탬프 명소 데이터 로딩 실패:', error);
      });

    return () => {
      leafletMapRef.current.remove();
    };
  }, [navigate]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 px-4 pt-4">🚋 트램 정류장 지도 보기</h2>
      <div id="map" ref={mapRef} style={{ height: '90vh', width: '100%' }} />
    </div>
  );
};

export default StationList;
