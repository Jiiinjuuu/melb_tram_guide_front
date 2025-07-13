// src/components/LatestReviewsPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LatestReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/getLatestReviews.php?page=${page}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch(() => {
        alert('리뷰를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🆕 최신 리뷰들</h2>

      {loading ? (
        <p>불러오는 중...</p>
      ) : reviews.length === 0 ? (
        <p>아직 등록된 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="bg-white p-4 shadow rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/review/${review.id}`)}
            >
              {review.image_full_url && (
                <img
                  src={review.image_full_url}
                  alt="리뷰 이미지"
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <p><strong>장소:</strong> {review.place_name}</p>
              <p><strong>작성자:</strong> {review.username}</p>
              <p className="text-gray-700">{review.content}</p>
              <p className="text-sm text-gray-500">{review.created_at}</p>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 페이지네이션 */}
      <div className="flex justify-center gap-4 mt-6">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            이전
          </button>
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LatestReviewsPage;
