import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Form, Question, QuestionOption, Response } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const { signOut } = await import('next-auth/react');
        signOut({ callbackUrl: '/login' });
      }
    }
    return Promise.reject(error);
  }
);

export const formApi = {
  getForms: async (): Promise<Form[]> => {
    const res = await api.get('/forms');
    return res.data;
  },
  getForm: async (id: number): Promise<Form> => {
    const res = await api.get(`/forms/${id}`);
    return res.data;
  },
  createForm: async (data: Partial<Form>): Promise<Form> => {
    const res = await api.post('/forms', data);
    return res.data;
  },
  updateForm: async (id: number, data: Partial<Form>): Promise<Form> => {
    const res = await api.patch(`/forms/${id}`, data);
    return res.data;
  },
  deleteForm: async (id: number): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },
  duplicateForm: async (id: number): Promise<Form> => {
    const res = await api.post(`/forms/${id}/duplicate`);
    return res.data;
  },
  publishForm: async (id: number): Promise<Form> => {
    const res = await api.post(`/forms/${id}/publish`);
    return res.data;
  },
  unpublishForm: async (id: number): Promise<Form> => {
    const res = await api.post(`/forms/${id}/unpublish`);
    return res.data;
  },
  getSummary: async (id: number): Promise<any> => {
    const res = await api.get(`/forms/${id}/summary`);
    return res.data;
  },
  getResponses: async (id: number): Promise<Response[]> => {
    const res = await api.get(`/forms/${id}/responses`);
    return res.data;
  }
};

export const questionApi = {
  createQuestion: async (formId: number, data: Partial<Question>): Promise<Question> => {
    const res = await api.post(`/forms/${formId}/questions`, data);
    return res.data;
  },
  updateQuestion: async (id: number, data: Partial<Question>): Promise<Question> => {
    const res = await api.patch(`/questions/${id}`, data);
    return res.data;
  },
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },
  reorderQuestions: async (formId: number, items: { id: number, position: number }[]): Promise<void> => {
    await api.put(`/forms/${formId}/questions/reorder`, { questions: items });
  }
};

export const optionApi = {
  createOption: async (questionId: number, data: Partial<QuestionOption>): Promise<QuestionOption> => {
    const res = await api.post(`/questions/${questionId}/options`, data);
    return res.data;
  },
  updateOption: async (id: number, data: Partial<QuestionOption>): Promise<QuestionOption> => {
    const res = await api.patch(`/options/${id}`, data);
    return res.data;
  },
  deleteOption: async (id: number): Promise<void> => {
    await api.delete(`/options/${id}`);
  }
};

export const publicApi = {
  getForm: async (slug: string): Promise<Form> => {
    const res = await api.get(`/public/forms/${slug}`);
    return res.data;
  },
  submitResponse: async (slug: string, answers: { question_id: number, value: string }[]): Promise<Response> => {
    const res = await api.post(`/public/forms/${slug}/responses`, { answers });
    return res.data;
  }
};

export const contactApi = {
  getContacts: async (): Promise<any[]> => {
    const res = await api.get(`/contacts/`);
    return res.data;
  }
};

export const webhookApi = {
  getWebhooks: async (formId: number): Promise<any[]> => {
    const res = await api.get(`/forms/${formId}/webhooks`);
    return res.data;
  },
  createWebhook: async (formId: number, data: any): Promise<any> => {
    const res = await api.post(`/forms/${formId}/webhooks`, data);
    return res.data;
  },
  updateWebhook: async (webhookId: number, data: any): Promise<any> => {
    const res = await api.patch(`/webhooks/${webhookId}`, data);
    return res.data;
  },
  deleteWebhook: async (webhookId: number): Promise<void> => {
    await api.delete(`/webhooks/${webhookId}`);
  }
};
