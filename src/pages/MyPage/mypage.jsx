import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [userStamps, setUserStamps] = useState([]); // 스탬프 배열로 변경
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('name') || '닉네임 없음';
    const email = localStorage.getItem('email') || '이메일 없음';
    setUserInfo({ name: name, email });

    // 스탬프 정보 불러오기
    axios.get('http://localhost/melb_tram_api/public/getUserStamps.php')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUserStamps(res.data); // 배열 전체 저장
        }
      });

    // 내가 쓴 후기 불러오기
    axios.get('http://localhost/melb_tram_api/public/getMyReviews.php')
      .then(res => {
        if (res.data.success) {
          setMyReviews(res.data.reviews);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
        <ul className="space-y-2">
          {myReviews.length === 0 ? (
            <p>작성한 후기가 없습니다.</p>
          ) : (
            myReviews.map((review, index) => (
              <li key={index} className="bg-white p-3 shadow rounded-lg">
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