import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const StationList = () => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const navigate = useNavigate();

  // 1. 정류장 마커 아이콘
  const tramIcon = L.icon({
    iconUrl: '/img/tram-pin.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  // 2. 스탬프 명소 아이콘 추가
  const stampIcon = L.icon({
    iconUrl: '/img/stamp_pin.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25]
  });

  useEffect(() => {
    // 지도 초기화
    leafletMapRef.current = L.map(mapRef.current).setView([-37.8136, 144.9631], 14);

    // 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMapRef.current);

    // 1. 정류장 마커 불러오기
    axios.get('http://localhost/melb_tram_api/public/getStations_map.php')
      .then(response => {
        response.data.forEach(station => {
          if (station.latitude && station.longitude) {
            const marker = L.marker([station.latitude, station.longitude], {
              icon: tramIcon
            }).addTo(leafletMapRef.current);

            marker.bindTooltip(`<strong>${station.name}</strong><br>${station.description}`);

            // 클릭 시 정류장 상세 페이지 이동
            marker.on('click', () => {
              navigate(`/stations/${station.id}`);
            });
          }
        });
      })
      .catch(error => {
        console.error('정류장 데이터 로딩 실패:', error);
      });

    // ✅ 2. 스탬프 명소 마커 불러오기
    axios.get('http://localhost/melb_tram_api/public/getStampPlaces.php')
      .then(response => {
        response.data.forEach(place => {
          if (place.latitude && place.longitude) {
            const marker = L.marker([place.latitude, place.longitude], {
              icon: stampIcon
            }).addTo(leafletMapRef.current);

            marker.bindTooltip(`<strong>${place.name}</strong><br>${place.description}<br>🎖 스탬프 명소`, {
              direction: 'top',
              offset: [0, -20],
              opacity: 1
            });

            // 클릭 시 아무 동작 없지만 추후 상세페이지 연결 가능
            // marker.on('click', () => { ... });
          }
        });
      })
      .catch(error => {
        console.error('스탬프 명소 데이터 로딩 실패:', error);
      });

    // cleanup
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
