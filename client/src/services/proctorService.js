import api from './api';

const proctorService = {
  startSession: async (testId) => {
    const response = await api.post('/proctor/session/start', { testId });
    return response.data;
  },

  logViolation: async (testId, violationType, details) => {
    const response = await api.post('/proctor/log-violation', {
      testId,
      violationType,
      details,
    });
    return response.data;
  },

  submitTest: async (testId, codeSubmissions) => {
    const response = await api.post('/proctor/submit', {
      testId,
      codeSubmissions,
    });
    return response.data;
  },

  getSession: async (testId) => {
    const response = await api.get(`/proctor/session/${testId}`);
    return response.data;
  },

  getAdminLogs: async () => {
    const response = await api.get('/proctor/admin/logs');
    return response.data;
  },

  getAdminLogDetail: async (id) => {
    const response = await api.get(`/proctor/admin/logs/${id}`);
    return response.data;
  },
};

export default proctorService;
