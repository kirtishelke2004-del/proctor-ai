import api from './api';

const testService = {
  getTests: async () => {
    const response = await api.get('/tests');
    return response.data;
  },

  getTestById: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },

  createTest: async (testData) => {
    const response = await api.post('/tests', testData);
    return response.data;
  },
};

export default testService;
