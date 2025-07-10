import axios from "axios";
import BASE_URL from '../config';


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
