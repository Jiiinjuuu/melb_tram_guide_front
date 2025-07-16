import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./mainpage.css";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/session_check.php`, {
      withCredentials: true
    })
    .then((res) => {
      if (res.data.loggedIn) {
        setUser(res.data.user);
      }
    })
    .catch(() => {});
  }, []);

  return (
    <div className="mainpage-modern">
      <header className="main-header">
        <span className="main-logo">🚋</span>
        <span className="main-title">Melbourne Tram Guide</span>
      </header>
      <div className="main-card">
        <h1>여행을 더 특별하게</h1>
        <p className="main-desc">AI가 추천하는 멜버른 트램 여행 코스<br/>나만의 맞춤 루트를 지금 만나보세요!</p>
        {user && (
          <p className="main-user">안녕하세요, <strong>{user.name}</strong>님!</p>
        )}
        <div className="main-actions">
          <button className="main-btn" onClick={() => navigate("/stations")}>🚏 역/장소 둘러보기</button>
          <button className="main-btn" onClick={() => navigate("/route-recommendation")}>🤖 AI 루트 추천</button>
          <button className="main-btn" onClick={() => navigate("/ranking")}>🏆 스탬프 랭킹</button>
          <button className="main-btn" onClick={() => navigate("/latest-reviews")}>📰 최신 리뷰</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
