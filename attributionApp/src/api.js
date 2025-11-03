
const API_BASE_URL = 'http://192.168.1.67:8000/api';

export const apiClient = {
  // Получение данных для страниц
  getPageData: async (pageName) => {
    const response = await fetch(`${API_BASE_URL}/${pageName}/`);
    return await response.json();
  },
  
  // Фильтрация данных
  getFilteredData: async (pageName, filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/${pageName}/?${queryParams}`);
    return await response.json();
  }
};