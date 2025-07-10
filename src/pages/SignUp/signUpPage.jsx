import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost/melb_tram_api/public/signup.php", formData);

      if (res.data.success) {
        setMessage("🎉 회원가입이 완료되었습니다!");
        setFormData({ name: "", email: "", password: "" });
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
