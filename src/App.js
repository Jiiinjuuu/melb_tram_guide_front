import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import Navbar from "./components/Navbar"; // 상단바 컴포넌트
import MainPage from "./pages/MainPage/mainpage";
import MyPage from "./pages/MyPage/mypage";
import StationList from "./pages/Stations/StationList";
import StationDetail from "./pages/Stations/StationDetail";
import StopDetailPage from './pages/Stations/StationDetail_map';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/stations" element={<StationList />} />
        <Route path="/stations/:id" element={<StationDetail />} />
        <Route path="/places_on_map/:id" element={<StopDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
