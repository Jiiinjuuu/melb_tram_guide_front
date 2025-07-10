import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StampRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost/melb_tram_api/public/get_stamp_ranking.php')
      .then((res) => {
        if (res.data.success) {
          setRanking(res.data.ranking);
        } else {
          console.error('데이터 불러오기 실패:', res.data.message);
        }
      })
      .catch((err) => console.error('에러:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🏆 스탬프 순위</h2>
      {loading ? (
        <p>불러오는 중...</p>
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
