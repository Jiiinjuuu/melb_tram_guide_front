import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔑 리디렉션용
import BASE_URL from '../../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // 🔑 페이지 이동

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/signup.php` ,
        formData,
        { withCredentials: true } // ✅ 세션 쿠키 주고받기
      );

      if (res.data.success) {
        setMessage("🎉 회원가입 및 자동 로그인 완료!");
        setFormData({ name: "", email: "", password: "" });

        // 🔑 약간의 지연 후 홈이나 마이페이지로 이동
        setTimeout(() => {
          navigate("/my-page"); // 원하면 다른 경로로 바꿔도 됨
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("⚠️ 이미 등록된 이메일입니다.");
      } else {
        setMessage("🚨 회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">회원가입</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Signup;
