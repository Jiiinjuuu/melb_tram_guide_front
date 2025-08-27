import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { useLanguage } from '../../i18n/LanguageContext';
import "./PlaceDetail.css";

const PlaceDetail = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [googleReviews, setGoogleReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // 여기서 activeTab 상태를 선언
  const [activeTab, setActiveTab] = useState('reviews'); // 기본값 'reviews'

  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 리뷰, Google Place 리뷰 데이터를 병렬로 가져오기
        const [reviewsRes, googleRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/getReviews.php?place_id=${id}`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/getGooglePlaceInfo.php?place_id=${id}`)
        ]);

        setReviews(reviewsRes.data);
        if (googleRes.data.google_reviews) {
          setGoogleReviews(googleRes.data.google_reviews);
        }
      } catch (err) {
        console.error('데이터 불러오기 오류:', err);
        setError(err.message || '리뷰 정보를 불러오는 중 오류가 발생했습니다.');
        setToast({
          message: err.message || '리뷰 정보를 불러오는 중 오류가 발생했습니다.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleReviewWrite = async () => {
    try {
      const session = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/session_check.php`, {
        withCredentials: true
      });

      if (session.data.loggedIn) {
        navigate(`/place/${id}/post_review`);
      } else {
        setToast({
          message: t('loginRequired'),
          type: 'warning'
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setToast({
        message: '로그인 상태 확인 중 오류 발생',
        type: 'error'
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const renderGoogleReviews = () => {
    if (googleReviews.length === 0) return null;

    return (
      <div className="google-reviews">
        <h3 className="text-lg font-semibold mb-3">💬 Google 리뷰</h3>
        <div className="space-y-4">
          {googleReviews.map((review, index) => (
            <div key={index} className="review-item border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {review.profile_photo_url && (
                    <img 
                      src={review.profile_photo_url} 
                      alt="프로필" 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{review.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐ {review.rating}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.time * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <LoadingSpinner size="large" text={t('loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">{t('error')}</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{t('reviews')}</h1>

      <div className="mb-6">
        <button
          onClick={handleReviewWrite}
          className="btn-primary"
        >
          {t('writeReview')}
        </button>
      </div>

      {/* 탭 네비게이션 - 기본 정보 탭 제거 */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            💬 리뷰 ({reviews.length + googleReviews.length})
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 'reviews' && (
          <div>
            {/* Google 리뷰 */}
            {renderGoogleReviews()}
            
            {/* 자체 리뷰 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">{t('reviews')}</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500">{t('noReviews')}</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    onClick={() => navigate(`/review/${review.id}`)}
                    className="mb-4 p-3 border rounded hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex justify-between">
                      <strong>{review.username || t('anonymous')} | ⭐ {review.rating}</strong>
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
        )}
      </div>

      {/* 토스트 알림 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PlaceDetail;
