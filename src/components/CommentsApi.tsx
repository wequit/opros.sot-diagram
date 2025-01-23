'use client';
import { useAuth } from '@/lib/utils/AuthContext';
import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  comment: string;
  action: string;
}

interface AddCommentParams {
  question_response: number;
  reply_to_comment: string;
}

export function useComments() {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем комментарии с сервера и объединяем с локальными
  useEffect(() => {
    const fetchComments = async () => {
      if (!token) {
        setError('Требуется авторизация');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Using token for request:', token);
        const response = await fetch('https://opros.sot.kg/api/v1/comments/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error('Failed to fetch comments');
        }

        const serverData = await response.json();
        
        // Получаем сохраненные комментарии из localStorage
        const savedComments = JSON.parse(localStorage.getItem('comments') || '{}');
        // Объединяем данные с сервера с локальными комментариями
        const mergedComments = serverData.map((comment: { id: number; action: string }) => ({
          ...comment,
          action: savedComments[comment.id] || comment.action
        }));

        setComments(mergedComments);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке комментариев');
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [token]);

  const addComment = async ({ question_response, reply_to_comment }: AddCommentParams) => {
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    try {
      console.log('Sending comment:', { question_response, reply_to_comment });
      const response = await fetch('https://opros.sot.kg/api/v1/comments/respond/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_response: question_response,
          reply_to_comment: reply_to_comment
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add comment error:', {
          status: response.status,
          response: errorText
        });
        throw new Error(`Ошибка добавления комментария: ${response.status}`);
      }

      const newComment = await response.json();
      console.log('New comment response:', newComment);

      // Сохраняем в localStorage
      const savedComments = JSON.parse(localStorage.getItem('comments') || '{}');
      savedComments[question_response] = reply_to_comment;
      localStorage.setItem('comments', JSON.stringify(savedComments));

      // Обновляем состояние с учетом локального хранилища
      setComments(prev => prev.map(comment => 
        comment.id === question_response 
          ? { ...comment, action: reply_to_comment }
          : comment
      ));
      
      return newComment;
    } catch (err) {
      console.error('Add comment error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при добавлении комментария');
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!token) {
      throw new Error('Требуется авторизация');
    }

    try {
      // Удаляем из localStorage
      const savedComments = JSON.parse(localStorage.getItem('comments') || '{}');
      delete savedComments[commentId];
      localStorage.setItem('comments', JSON.stringify(savedComments));

      // Обновляем состояние
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, action: '' }  // Очищаем действие
          : comment
      ));

      return true;
    } catch (err) {
      console.error('Delete comment error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при удалении комментария');
      throw err;
    }
  };

  return { comments, isLoading, error, addComment, deleteComment };
} 