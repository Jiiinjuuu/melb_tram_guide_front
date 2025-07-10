import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PlaceReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ✅ 세션 로그인 확인
  useEffect(() => {
    axios.get('http://localhost/melb_tram_api/public/session_check.php', {
      withCredentials: true
    })
    .then(res => {
      if (!res.data.loggedIn) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    })
    .catch(() => {
      alert('세션 확인 실패');
      navigate('/login');
    });
  }, [navigate]);

  // ✅ 명소 정보 불러오기
  useEffect(() => {
    axios.get(`http://localhost/melb_tram_api/public/getPlaceDetails.php?place_id=${id}`)
      .then(res => {
        const placeData = res.data.place;
        placeData.is_stamp = res.data.is_stampPlace;
        setPlace(placeData);
      })
      .catch(err => console.error('명소 정보 로딩 실패:', err));
  }, [id]);

  // ✅ 후기 등록
  const handleSubmit = () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append('place_id', id);
    formData.append('content', content);
    formData.append('rating', rating);
    if (image) formData.append('image', image);

    axios.post('http://localhost/melb_tram_api/public/postReview.php', formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(() => {
      if (place?.is_stamp == 1) {
        navigate(`/stamp/${id}`);
      } else {
        navigate(`/place/${id}`);
      }
    })
    .catch(err => {
      console.error('후기 등록 실패:', err);
      alert('후기 등록 중 오류가 발생했습니다.');
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  if (!place) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✍ {place.name} 후기 작성</h1>

      <textarea
        className="w-full border rounded p-3 mb-3"
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="이 명소에 대한 솔직한 후기를 남겨주세요"
      />

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium">⭐ 평점:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">사진 첨부 (선택)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="선택한 이미지 미리보기"
            className="mt-2 rounded w-full h-48 object-cover border"
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        등록하기
      </button>
    </div>
  );
};

export default PlaceReviewForm;
