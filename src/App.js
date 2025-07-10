import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import Navbar from "./components/Navbar"; // 상단바 컴포넌트
import MainPage from "./pages/MainPage/mainpage";
import MyPage from "./pages/MyPage/mypage";
import StationList from "./pages/Stations/StationList";
import PlacesList from "./pages/Stations/PlacesList";
import PlacesOnMap from './pages/Stations/PlacesOnMap';
import Signup from "./pages/SignUp/signUpPage";
import LoginPage from './pages/Login/loginPage';
import PlaceDetail from './pages/PlaceReviews/PlaceDetail';
import PlaceReviewForm from './pages/PostReview/PlaceReviewForm';
import ReviewDetail from './pages/ReviewDetail/ReviewDetail';
import StampPage from './pages/StampPage/stamp_page';
import StampRanking from './pages/StampRanking/stamp_ranking';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/stations" element={<StationList />} />
        <Route path="/stations/:id" element={<PlacesList />} />
        <Route path="/places_on_map/:id" element={<PlacesOnMap />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/place/:id" element={<PlaceDetail />} />
        <Route path="/place/:id/post_review" element={<PlaceReviewForm />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/stamp/:place_id" element={<StampPage />} />
        <Route path="/ranking" element={<StampRanking />} />
      </Routes>
    </Router>
  );
}

export default App;
