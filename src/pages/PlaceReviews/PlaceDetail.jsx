import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../config';

const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/getPlaceDetails.php?place_id=${id}`)
      .then(res => setPlace(res.data))
      .catch(err => console.error('명소 정보 오류:', err));

    axios.get( `${BASE_URL}/getReviews.php?place_id=${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('후기 불러오기 오류:', err));
  }, [id]);

  const handleReviewWrite = () => {
    axios.get(`${BASE_URL}/session_check.php`, {
      withCredentials: true
    })
    .then(res => {
      if (res.data.loggedIn) {
        navigate(`/place/${id}/post_review`);
      } else {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    })
    .catch(() => {
      alert("로그인 상태 확인 중 오류 발생");
      navigate("/login");
    });
  };

  if (!place) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{place.name}</h1>
      <p className="mb-4 text-gray-700">{place.description}</p>

      <div className="mb-6">
        <button
          onClick={handleReviewWrite}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✍ 내 후기 작성하기
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">💬 후기 목록</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">아직 후기가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => navigate(`/review/${review.id}`)}
              className="mb-4 p-3 border rounded hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between">
                <strong>{review.username || '익명'} | ⭐ {review.rating}</strong>
                <span className="text-sm text-gray-500">({review.created_at})</span>
              </div>
              {review.image_full_url && (
                <img
                  src={review.image_full_url}
                  alt="후기 이미지"
                  className="mt-2 max-h-48 object-cover rounded"
                />
              )}
              <p className="mt-1 text-gray-800">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
