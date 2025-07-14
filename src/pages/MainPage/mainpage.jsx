import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./mainpage.css";

const MainPage = () => {
  const [isApp, setIsApp] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.includes("MyAppWebView")) {
      setIsApp(true);
    }

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/session_check.php`, {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.loggedIn) {
        setUser(res.data.user);
      }
    })
    .catch((err) => {
      console.error("세션 확인 중 오류 발생:", err);
    });
  }, []);

  return (
    <div className={`mainpage ${isApp ? "app" : "web"}`}>
      <div className="main-overlay" />
      <div className="main-content">
        <h1 className="main-title">멜버른 트램 명소 가이드</h1>
        <p className="main-subtitle">우리만의 여정을 지금 바로 시작해보세요</p>

        {user && (
          <p className="welcome-user">안녕하세요, <strong>{user.name}</strong>님!</p>
        )}

        <div className="main-buttons">
          <button onClick={() => navigate("/stations")}>📍 스탬프 찍기</button>
          <button onClick={() => navigate("/ranking")}>🏆 랭킹 보기</button>
          <button onClick={() => navigate("/latest-reviews")}>🆕 최신 리뷰</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
