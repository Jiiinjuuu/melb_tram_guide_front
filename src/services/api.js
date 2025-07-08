import axios from "axios";

const BASE_URL = "http://localhost/melb_tram_api/public"; // php 파일 있는 경로

export const fetchStations = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getStations.php`);
    return res.data;
  } catch (err) {
    console.error("정류장 목록 불러오기 실패:", err);
    return [];
  }
};

export const fetchPlacesByStationId = async (stationId) => {
  try {
    const res = await axios.get(`${BASE_URL}/getPlaces.php?station_id=${stationId}`);
    return res.data;
  } catch (err) {
    console.error("장소 목록 불러오기 실패:", err);
    return [];
  }
};
