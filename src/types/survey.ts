export interface QuestionResponse {
  id: number;
  selected_option: string;
  multiple_selected_options?: string[];
  text_response?: string;
  created_at: string;
  gender: string;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: string;
  question_responses: QuestionResponse[];
  options?: string[];
} 