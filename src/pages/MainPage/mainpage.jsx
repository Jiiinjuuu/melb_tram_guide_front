import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ axios 불러오기
import "./mainpage.css";
import BASE_URL from '../../config'; // config.js에서 불러온 환경변수

const MainPage = () => {
  const [isApp, setIsApp] = useState(false);
  const [user, setUser] = useState(null); // ✅ 사용자 상태 저장
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.includes("MyAppWebView")) {
      setIsApp(true);
    }

    // ✅ 로그인 상태 확인
axios.get(`${BASE_URL}/session_check.php`, {
  withCredentials: true
})
.then((res) => {
  console.log("✅ 세션 체크 응답:", res.data); // 이거 먼저 찍어보세요!
  if (res.data.loggedIn) {
    setUser(res.data.user);
  }
})
.catch((err) => {
  console.error("세션 확인 중 오류 발생:", err);
});
  }, []);

  const handleStart = () => {
    navigate("/stations");
  };

  const handleRanking = () => {
    navigate("/ranking");
  };

    const handleLatestReviews = () => {
    navigate("/latest-reviews");
  };

  return (
    <div className={`mainpage ${isApp ? "app" : "web"}`}>
      <div className="overlay" />
      <div className="content">
        <h1>Welcome to Our Service</h1>
        <p>Explore Melbourne’s Tram-based Attractions</p>

        {user ? (
          <p style={{ marginTop: "10px", color: "#fff" }}>
            안녕하세요, <strong>{user.name}</strong>님!
          </p>
        ) : (
          <p style={{ marginTop: "10px", color: "#fff" }}>
            로그인 후 이용해주세요.
          </p>
        )}

        <button onClick={handleStart}>Get Started</button>
        <button onClick={handleRanking} style={{ marginTop: "10px" }}>
          🏆 스탬프 랭킹 보기
        </button>
                <button onClick={handleLatestReviews} style={{ marginTop: "10px" }}>
          🆕 최신 리뷰들 보기
        </button>
      </div>
    </div>
  );
};

export default MainPage;
