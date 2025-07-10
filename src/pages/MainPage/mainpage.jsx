import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ axios 불러오기
import "./mainpage.css";

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
    axios
      .get("http://localhost/melb_tram_api/public/session_check.php", {
        withCredentials: true
      })
      .then((res) => {
        if (res.data.loggedIn) {
          setUser(res.data.user); // 로그인된 유저 정보 저장
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
      </div>
    </div>
  );
};

export default MainPage;
