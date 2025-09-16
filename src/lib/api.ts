import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register-faculty', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/faculty/profile');
    return response.data;
  },
};

// Face Recognition API
export const faceAPI = {
  recognizeFace: async (imageData: string, subject?: string, className?: string, division?: string) => {
    const response = await api.post('/face-recognition/recognize', {
      image: imageData,
      subject,
      class: className,
      division,
    });
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getByStudent: async (studentId: string, startDate?: string, endDate?: string) => {
    const response = await api.get('/attendance/student', {
      params: { studentId, startDate, endDate },
    });
    return response.data;
  },
  
  getByClass: async (className: string, division: string, date: string) => {
    const response = await api.get('/attendance/class', {
      params: { className, division, date },
    });
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  getById: async (studentId: string) => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  },
  
  update: async (studentId: string, data: any) => {
    const response = await api.put(`/students/${studentId}`, data);
    return response.data;
  },
};

// Faculty API
export const facultyAPI = {
  getAll: async () => {
    const response = await api.get('/faculty');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/faculty/profile');
    return response.data;
  },
};

export default api;