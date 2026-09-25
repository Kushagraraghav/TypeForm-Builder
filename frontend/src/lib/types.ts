export interface Form {
  id: number;
  title: string;
  slug: string;
  status: string;
  thank_you_message: string;
  theme_json?: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
  response_count: number;
}

export interface Question {
  id: number;
  form_id: number;
  type: 'SHORT_TEXT' | 'LONG_TEXT' | 'MULTIPLE_CHOICE' | 'DROPDOWN' | 'EMAIL' | 'NUMBER' | 'YES_NO' | 'RATING';
  title: string;
  description?: string;
  required: boolean;
  position: number;
  settings_json?: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  question_id: number;
  label: string;
  position: number;
}

export interface Response {
  id: number;
  form_id: number;
  submitted_at: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  response_id: number;
  question_id: number;
  value?: string;
}
