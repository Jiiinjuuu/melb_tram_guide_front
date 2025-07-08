import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlacesByStationId } from "../../services/api";

const StationDetail = () => {
  const { id } = useParams();  // URL에서 station_id 가져오기
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate(); // ✅ 이동용

  useEffect(() => {
    fetchPlacesByStationId(id).then(data => {
      setPlaces(data);
    });
  }, [id]);

  const handleMapView = () => {
    navigate(`/places_on_map/${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🛑 정류장 ID: {id}</h2>

      <button
        onClick={handleMapView}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        지도에서 보기
      </button>

      <ul className="space-y-4">
        {places.map((place) => (
          <li key={place.id} className="border-b pb-2">
            <strong>{place.name}</strong> ({place.category} / {place.subcategory})<br />
            <small className="text-gray-600">{place.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StationDetail;
