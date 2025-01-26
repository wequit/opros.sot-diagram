'use client';
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Требуется авторизация');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://opros.sot.kg/api/v1/comments/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        
        console.log('API Response:', data);
        
        // Фильтруем только комментарии из 17-го вопроса (18-го по отображению)
        const questionComments = data.filter((item: any) => 
          item.question_id === 17 || // ID вопроса
          item.text_response // Проверяем наличие текстового ответа
        ).map((item: any) => ({
          id: item.id,
          comment: item.text_response || '', // Текст замечания
          action: item.reply_to_comment || '' // Комментарий к замечанию
        }));

        setComments(questionComments);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const addComment = async ({ question_response, reply_to_comment }: AddCommentParams) => {
    const token = localStorage.getItem('access_token');
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
    const token = localStorage.getItem('access_token');
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