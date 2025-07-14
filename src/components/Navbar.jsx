import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isApp, setIsApp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.includes("MyAppWebView")) {
      setIsApp(true);
    }

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/session_check.php`, {
      withCredentials: true
    })
    .then(res => {
      if (res.data.loggedIn) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    })
    .catch(() => {
      setUser(null);
    });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout.php`, {
        withCredentials: true
      });
      setUser(null);
      alert("로그아웃 되었습니다.");
      navigate("/login");
    } catch (err) {
      alert("로그아웃 중 오류 발생");
    }
  };

  return (
    <nav className={`navbar ${isApp ? "app" : "web"}`}>
      <div className="navbar-logo">
        <Link to="/">🏨 멜버른트램가이드</Link>
      </div>

      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/my-page">My Page</Link>
            <span
              onClick={handleLogout}
              className="navbar-link"
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
