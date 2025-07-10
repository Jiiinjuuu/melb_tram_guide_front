// 해당 정류장의 명소들을 지도에 띄우는 역할
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const PlacesOnMap = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  // 1. 정류장 아이콘
  const tramIcon = L.icon({
    iconUrl: "/img/tram-pin.png",
    iconSize: [40, 40], // 너비, 높이
    iconAnchor: [20, 40], // 마커 포인트
    popupAnchor: [0, -35], // 팝업 위치 조정
  });

  // 2. 명소 아이콘
  const placeIcon = L.icon({
    iconUrl: "/img/place.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });

  // 3. 스탬프 명소 아이콘
const stampIcon = L.icon({
  iconUrl: "/img/stamp_pin.png",  // 스탬프 마커 이미지 경로
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

  useEffect(() => {
    axios
      .get('http://localhost/melb_tram_api/public/getStations.php')
      .then((res) => {
        const target = res.data.find((s) => s.id === parseInt(id));
        setStation(target);
      })
      .catch((err) => console.error("정류장 정보 불러오기 실패:", err));

    axios
      .get(`http://localhost/melb_tram_api/public/getplaces_map.php?station_id=${id}`)
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("명소 정보 불러오기 실패:", err));
  }, [id]);

  if (!station) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{station.name}</h1>

      <button
        onClick={() => navigate(`/stations/${id}`)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔙 정류장 리스트 보기
      </button>

      <MapContainer
        center={[parseFloat(station.latitude), parseFloat(station.longitude)]}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 정류장 마커 */}
        <Marker
          position={[station.latitude, station.longitude]}
          icon={tramIcon}
        >
          <Popup>{station.name} (정류장)</Popup>
        </Marker>

        {/* 명소 마커 */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[parseFloat(place.latitude), parseFloat(place.longitude)]}
            icon={place.is_stampPlace === 1 ? stampIcon : placeIcon}
            eventHandlers={{
              click: () => navigate(`/place/${place.id}`) // ✅ 클릭 시 페이지 이동
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              <div>
                <strong>{place.name}</strong>
                <br />
                {place.description}
                {place.is_stampPlace === 1 && (
                  <div className="mt-1 text-green-600 font-semibold">🎖 스탬프 명소</div>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PlacesOnMap;
