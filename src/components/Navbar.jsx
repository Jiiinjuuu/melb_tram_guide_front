import { Link } from "react-router-dom";
import './Navbar.css'

function Navbar_bts() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏨 멜버른트램가이드</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/my-page">My Page</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar_bts;