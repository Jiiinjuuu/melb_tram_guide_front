import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReviewDetail = () => {
  const { id } = useParams(); // review_id
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const user_id = 1; // 임시 사용자 ID

  useEffect(() => {
    axios.get(`http://localhost/melb_tram_api/public/getReviewById.php?review_id=${id}`)
      .then(res => setReview(res.data))
      .catch(err => console.error('후기 정보 오류:', err));

    axios.get(`http://localhost/melb_tram_api/public/getComments.php?review_id=${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error('댓글 정보 오류:', err));
  }, [id]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    axios.post('http://localhost/melb_tram_api/public/postComment.php', {
      review_id: id,
      user_id,
      content: newComment
    }).then(res => {
      if (res.data.success) {
        setComments(prev => [...prev, res.data.comment]);
        setNewComment('');
      }
    });
  };

  const handleDeleteComment = (commentId) => {
    axios.post('http://localhost/melb_tram_api/public/deleteComment.php', {
      comment_id: commentId
    }).then(() => {
      setComments(prev => prev.filter(c => c.id !== commentId));
    });
  };

  if (!review) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 후기 상세</h1>

      <div className="bg-white border rounded p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-gray-800">{review.username || '익명'}</div>
          <div className="text-sm text-gray-500">{review.created_at}</div>
        </div>
        <div className="text-yellow-500 mb-2">⭐ {review.rating}</div>
        <div className="text-gray-900 whitespace-pre-line mb-2">{review.content}</div>
        {review.image_url && (
          <img
            src={`http://localhost/melb_tram_api${review.image_url}`}
            alt="후기 이미지"
            className="mt-2 max-h-96 w-full object-cover rounded"
          />
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">💬 댓글</h2>
      <div className="space-y-2 mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="text-sm flex justify-between items-center border-b pb-1">
            <span>
              💬 <strong>{comment.username || '익명'}:</strong> {comment.content}
            </span>
            {comment.user_id === user_id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-500 hover:underline"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          className="w-full border p-2 rounded text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleSubmitComment}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          댓글 등록
        </button>
      </div>
    </div>
  );
};

export default ReviewDetail;
