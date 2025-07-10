import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StampPage = () => {
  const { place_id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('스탬프 확인 중...');
  const user_id = 1; // 임시 하드코딩

  useEffect(() => {
    const checkAndAddStamp = async () => {
      try {
        const res = await axios.post('http://localhost/melb_tram_api/public/stamp_check.php', {
          user_id,
          place_id,
        });

        if (res.data.status === 'new') {
          setMessage('🎉 스탬프를 획득하셨습니다!');
          setTimeout(() => {
            navigate(`/place/${place_id}`);
          }, 5000); // 5초 후 이동
        } else if (res.data.status === 'exists') {
          setMessage('✅ 이미 스탬프를 획득하셨습니다!');
          setTimeout(() => {
            navigate(`/place/${place_id}`);
          }, 5000);
        } else {
          setMessage('⚠️ 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        setMessage('❌ 서버 오류입니다.');
        console.error(error);
      }
    };

    if (user_id && place_id) {
      checkAndAddStamp();
    }
  }, [user_id, place_id, navigate]);

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
