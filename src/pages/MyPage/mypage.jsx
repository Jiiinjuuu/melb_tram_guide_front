import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import BASE_URL from '../../config'; // config.js에서 불러온 환경변수

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userStamps, setUserStamps] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ 추가

  useEffect(() => {
    axios.get(`${BASE_URL}/session_check.php`, {
      withCredentials: true
    })
    .then(res => {
      if (res.data.loggedIn) {
        setUserInfo(res.data.user);

        axios.get(`${BASE_URL}/getUserStamps.php`, {
          withCredentials: true
        }).then(res => {
          if (Array.isArray(res.data)) {
            setUserStamps(res.data);
          }
        });

        axios.get(`${BASE_URL}/getMyReviews.php`, {
          withCredentials: true
        }).then(res => {
          if (res.data.success) {
            setMyReviews(res.data.reviews);
          }
        }).finally(() => setLoading(false));
      } else {
        alert("로그인이 필요한 페이지입니다.");
        window.location.href = "/login";
      }
    })
    .catch(() => {
      alert("세션 확인 중 오류가 발생했습니다.");
      window.location.href = "/login";
    });
  }, []);

  if (!userInfo) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🙋 마이페이지</h2>

      <div className="mb-6 bg-white shadow p-4 rounded-lg">
        <p><strong>이름:</strong> {userInfo.name}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>내 스탬프:</strong> {userStamps.length}개</p>

        {userStamps.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">📍 받은 스탬프 목록</h4>
            <ul className="space-y-2">
              {userStamps.map((stamp, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded border">
                  <p><strong>{stamp.place_name}</strong> ({stamp.category} / {stamp.subcategory})</p>
                  <p className="text-sm text-gray-500">획득일: {stamp.earned_at}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">📝 내가 쓴 후기</h3>
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <ul className="space-y-4">
          {myReviews.length === 0 ? (
            <p>작성한 후기가 없습니다.</p>
          ) : (
            myReviews.map((review, index) => (
              <li
                key={index}
                className="bg-white p-4 shadow rounded-lg cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/review/${review.id}`)} // ✅ 클릭 시 이동
              >
                {review.image_full_url && (
                  <img
                    src={review.image_full_url}
                    alt="후기 이미지"
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <p><strong>장소:</strong> {review.place_name}</p>
                <p><strong>내용:</strong> {review.content}</p>
                <p className="text-sm text-gray-500">{review.created_at}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default MyPage;
