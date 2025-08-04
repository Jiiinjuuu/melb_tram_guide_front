import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRouteRecommendation } from '../../services/api';
import './RouteRecommendation.css';

const RouteRecommendation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: [],
    duration: '',
    activity_level: '',
    start_station: null
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showRecommendBtn, setShowRecommendBtn] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState('pending');

  React.useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const interestOptions = [
    { id: 'culture', label: '문화/예술', icon: '🎨' },
    { id: 'food', label: '음식/카페', icon: '☕' },
    { id: 'shopping', label: '쇼핑', icon: '🛍️' },
    { id: 'nature', label: '자연/공원', icon: '🌳' },
    { id: 'history', label: '역사/건축', icon: '🏛️' }
  ];

  const durationOptions = [
    { id: '1-2hours', label: '1-2시간 (빠른 투어)' },
    { id: '3-4hours', label: '3-4시간 (반나절)' },
    { id: '5-6hours', label: '5-6시간 (하루)' }
  ];

  const activityOptions = [
    { id: 'easy', label: '쉬운 (걷기 최소화)' },
    { id: 'normal', label: '보통 (적당한 걷기)' },
    { id: 'challenging', label: '도전적 (많은 걷기)' }
  ];

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setShowLoading(true);
      setShowRecommendBtn(false);
      setLoadingDone(false);
      setTimeout(() => {
        setLoadingDone(true);
        setShowLoading(false);
        setShowRecommendBtn(true);
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const getRecommendation = async () => {
    setLoading(true);
    try {
      if (locationStatus !== 'success') {
        alert('현재 위치 정보를 받아올 수 없습니다. 위치 권한을 허용해 주세요.');
        setLoading(false);
        return;
      }
      const data = await fetchRouteRecommendation({
        interest: formData.interests[0] || "관광",
        time: formData.duration || "오전",
        latitude: userLocation.lat,
        longitude: userLocation.lng
      });
      if (data.success) {
        setRecommendation(data);
      }
    } catch (error) {
      console.error('추천 요청 실패:', error);
      alert('추천을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const showBack = step > 1;
    if (step === 3 && (showLoading || showRecommendBtn)) {
      return (
        <div className="step-container">
          <h2>{loadingDone ? "✅ 추천 루트 생성 완료!" : "🚀 추천 루트 생성 중..."}</h2>
          <p>{loadingDone ? "선택하신 조건에 맞는 최적의 루트를 찾았습니다" : "선택하신 조건에 맞는 최적의 루트를 찾고 있습니다"}</p>
          {showLoading && <div className="loading-spinner"><div className="spinner"></div></div>}
          {showRecommendBtn && <button onClick={getRecommendation} className="btn-primary">추천받기</button>}
        </div>
      );
    }

    return (
      <div className="step-container">
        {step === 1 && (
          <>
            <h2>🎯 관심 분야를 선택해주세요</h2>
            <p>여러 개 선택 가능합니다</p>
            <div className="options-grid">
              {interestOptions.map(option => (
                <button key={option.id} className={`option-button ${formData.interests.includes(option.id) ? 'selected' : ''}`} onClick={() => handleInterestToggle(option.id)}>
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {formData.interests.includes(option.id) && <span className="selected-check">✔️</span>}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>⏱️ 소요 시간을 선택해주세요</h2>
            <div className="options-list">
              {durationOptions.map(option => (
                <button key={option.id} className={`option-button ${formData.duration === option.id ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, duration: option.id }))}>
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2>🚶 활동 강도를 선택해주세요</h2>
            <div className="options-list">
              {activityOptions.map(option => (
                <button key={option.id} className={`option-button ${formData.activity_level === option.id ? 'selected' : ''}`} onClick={() => setFormData(prev => ({ ...prev, activity_level: option.id }))}>
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="navigation-buttons-card">
          {showBack ? <button onClick={handleBack} className="btn-secondary">이전</button> : <div />}
          <button
            onClick={handleNext}
            className="btn-primary"
            disabled={
              (step === 1 && formData.interests.length === 0) ||
              (step === 2 && !formData.duration) ||
              (step === 3 && !formData.activity_level)
            }
          >다음</button>
        </div>
      </div>
    );
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;
    const { route, summary, story, detailed_story } = recommendation;
    const totalHours = Math.floor(summary.total_time / 60);
    const totalMinutes = summary.total_time % 60;
    const displayStory = detailed_story || story || "";

    return (
      <div className="recommendation-container">
        <h2>🚀 추천 루트</h2>
        <div className="route-summary">
          <div className="summary-item">
            <span className="summary-icon">⏱️</span>
            <span>총 소요시간: {totalHours}시간 {totalMinutes}분</span>
          </div>
          <div className="summary-item">
            <span className="summary-icon">🚶</span>
            <span>총 거리: {Number(summary.total_distance).toFixed(1)}km</span>
          </div>
        </div>

        <div className="route-details">
          {route.map((place, index) => (
            <div key={place.id || index} className="route-place">
              <div className="place-number">{index + 1}</div>
              <div className="place-info">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <div className="place-meta">
                  <span>🏷️ {place.type}</span>
                  <span>⏱️ {place.estimated_time || 60}분</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {detailed_story && (
          <div className="detailed-story" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginTop: '20px', fontSize: '14px', lineHeight: '1.6' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>📖 상세 여행 가이드</h3>
            <div style={{ whiteSpace: 'pre-line' }}>{detailed_story}</div>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={() => navigate('/stations')} className="btn-primary">지도에서 보기</button>
          <button onClick={() => setStep(1)} className="btn-secondary">다시 추천받기</button>
        </div>
      </div>
    );
  };

  return (
    <div className="route-recommendation">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">← 돌아가기</button>
        <h1>AI 루트 추천</h1>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <div className="content">
        {locationStatus === 'pending' && <div style={{ color: '#888', marginBottom: 8 }}>📡 현재 위치를 불러오는 중...</div>}
        {locationStatus === 'error' && <div style={{ color: 'red', marginBottom: 8 }}>⚠️ 위치 권한이 거부되었거나 위치 정보를 가져올 수 없습니다.</div>}
        {recommendation ? renderRecommendation() : renderStep()}
      </div>
    </div>
  );
};

export default RouteRecommendation;
