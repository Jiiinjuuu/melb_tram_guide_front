import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config';

const StampRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(
        `${BASE_URL}/get_stamp_ranking.php`)
      .then((res) => {
        if (res.data.success) {
          setRanking(res.data.ranking);
        } else {
          setError('데이터를 불러오지 못했습니다.');
        }
      })
      .catch(() => setError('서버와의 통신에 실패했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🏆 스탬프 순위</h2>

      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : ranking.length === 0 ? (
        <p>아직 스탬프를 받은 유저가 없습니다.</p>
      ) : (
        <ul className="space-y-2 list-disc pl-6">
          {ranking.map((user, index) => (
            <li key={user.user_id}>
              <span className="font-semibold">
                {index + 1}위. {user.name} - {user.stamp_count}개
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StampRanking;
