import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import "./mainpage.css";

const MainPage = () => {
  const [isApp, setIsApp] = useState(false);
  const navigate = useNavigate(); // ✅ 이게 꼭 필요!

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.includes("MyAppWebView")) {
      setIsApp(true);
    }
  }, []);

  const handleStart = () => {
    navigate("/stations"); // ✅ /stations로 이동
  };

    const handleRanking = () => {
    navigate("/ranking"); // ✅ 스탬프 랭킹으로 이동
  };

  return (
    <div className={`mainpage ${isApp ? "app" : "web"}`}>
      <div className="overlay" />
      <div className="content">
        <h1>Welcome to Our Service</h1>
        <p>Explore Melbourne’s Tram-based Attractions</p>
        <button onClick={handleStart}>Get Started</button> {/* ✅ 클릭 이벤트 연결 */}
                <button onClick={handleRanking} style={{ marginTop: "10px" }}>
          🏆 스탬프 랭킹 보기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
