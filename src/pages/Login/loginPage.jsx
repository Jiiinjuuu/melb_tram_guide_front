import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login.php`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      console.log("📦 응답 데이터:", response.data);

      if (response.data && response.data.success === true) {
        setUser(response.data.user);
        setErrorMsg("");
        alert(`환영합니다, ${response.data.user.name}님!`);
        navigate("/");
      } else {
        setErrorMsg(response.data.error || "로그인에 실패했습니다.");
      }

    } catch (err) {
      console.error('❗로그인 요청 실패:', err);
      if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">로그인</h2>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          로그인
        </button>
      </form>

      <button onClick={handleRegister} className="btn btn-secondary w-100 mt-3">
        회원가입
      </button>

      {user && (
        <div className="alert alert-success mt-4">
          <strong>{user.name}</strong> 님, 로그인되었습니다!<br />
          이메일: {user.email}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
