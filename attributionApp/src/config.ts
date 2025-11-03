

export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.67:8000/api', // Ваш реальный IP
  MINIO_URL: 'http://192.168.1.67:9000',    // Ваш реальный IP
};

// Функция для проверки подключения
export const checkConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/server-info/`);
    return response.ok;
  } catch (error) {
    console.error('❌ Ошибка подключения к API:', error);
    return false;
  }
};