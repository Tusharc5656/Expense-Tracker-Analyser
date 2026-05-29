import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/expenses`;
const API_URL_ANALYTICS = `${import.meta.env.VITE_API_URL || ''}/api/analytics`;

const getHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const getAllExpenses = (page = 0, size = 10) => {
  return axios.get(`${API_URL}?page=${page}&size=${size}`, { headers: getHeader() });
};

const createExpense = (expenseData) => {
  return axios.post(API_URL, expenseData, { headers: getHeader() });
};

const updateExpense = (id, expenseData) => {
  return axios.put(`${API_URL}/${id}`, expenseData, { headers: getHeader() });
};

const deleteExpense = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getHeader() });
};

const getAnalytics = (month, year) => {
  const m = month || new Date().getMonth() + 1;
  const y = year || new Date().getFullYear();
  return axios.get(`${API_URL_ANALYTICS}/monthly?month=${m}&year=${y}`, { headers: getHeader() });
};

const expenseService = {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAnalytics
};

export default expenseService;
