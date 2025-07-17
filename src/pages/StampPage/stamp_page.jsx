import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StampPage = () => {
  const { place_id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('스탬프 확인 중...');

  useEffect(() => {
    const checkAndAddStamp = async () => {
      try {
        // ✅ 세션 확인
        const session = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/session_check.php`, {
          withCredentials: true
        });

        if (!session.data.loggedIn) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        // ✅ 스탬프 확인 및 등록 요청
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/stamp_check.php`,
          { place_id },
          { withCredentials: true }
        );

        // ✅ 응답 처리 분기
        if (res.data.status === 'new') {
          setMessage('🎉 스탬프를 획득하셨습니다!');
        } else if (res.data.status === 'exists') {
          setMessage('✅ 이미 스탬프를 획득하셨습니다!');
        } else if (res.data.status === 'no_image') {
          setMessage('📸 이미지를 포함한 후기만 스탬프를 받을 수 있어요!');
        } else {
          setMessage('⚠️ 오류가 발생했습니다. 다시 시도해주세요.');
        }

        // ✅ 5초 후 돌아가기
        setTimeout(() => {
          navigate(`/place/${place_id}`);
        }, 5000);
        
      } catch (error) {
        setMessage('❌ 서버 오류입니다.');
        console.error(error);
      }
    };

    if (place_id) {
      checkAndAddStamp();
    }
  }, [place_id, navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🏅 스탬프 페이지</h1>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        onClick={() => navigate(`/place/${place_id}`)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        바로 돌아가기
      </button>
    </div>
  );
};

export default StampPage;
