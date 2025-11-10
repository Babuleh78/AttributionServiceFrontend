import React from 'react';
import { API_CONFIG } from '../config';

export const ConnectionInfo: React.FC = () => {
  const [serverInfo, setServerInfo] = React.useState<any>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');

  // Функция для получения информации о сервере
  const fetchServerInfo = async () => {
    try {
      console.log('🔍 Проверяем подключение к:', `${API_CONFIG.BASE_URL}/composers/`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/composers/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Получаем реальный URL из response
      const actualUrl = response.url;
      const serverIp = new URL(actualUrl).hostname;
      
      setServerInfo({
        server_ip: serverIp,
        actual_api_url: actualUrl,
        composers_count: data.length,
        status: 'connected'
      });
      
      setConnectionStatus('connected');
      console.log('✅ Успешное подключение к API');
      
    } catch (error) {
      console.error('❌ Ошибка получения информации о сервере:', error);
      setConnectionStatus('error');
      setServerInfo({
        configured_url: API_CONFIG.BASE_URL,
        status: 'error'
      });
    }
  };

  React.useEffect(() => {
    fetchServerInfo();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'error': return '#f44336';
      case 'checking': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '✅ Подключено';
      case 'error': return '❌ Ошибка';
      case 'checking': return '🔄 Проверка...';
      default: return '❓ Неизвестно';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '400px',
      fontFamily: 'monospace',
      border: `2px solid ${getStatusColor()}`
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: getStatusColor() }}>
        🔗 Подключение к бэкенду
      </h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Статус:</strong> {getStatusText()}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>IP в конфиге:</strong>
        <div style={{ wordBreak: 'break-all', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '3px' }}>
          {API_CONFIG.BASE_URL}
        </div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>MINIO в конфиге:</strong>
        <div style={{ wordBreak: 'break-all', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '3px' }}>
          {API_CONFIG.MINIO_URL}
        </div>
      </div>
      
      {serverInfo && (
        <>
          {serverInfo.server_ip && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Реальный IP сервера:</strong>
              <div style={{ 
                wordBreak: 'break-all', 
                background: serverInfo.server_ip.includes('192.168.1.67') ? 'rgba(255,255,0,0.2)' : 'rgba(255,255,255,0.1)', 
                padding: '4px', 
                borderRadius: '3px',
                color: serverInfo.server_ip.includes('192.168.1.67') ? '#FFD700' : 'white'
              }}>
                {serverInfo.server_ip}
              </div>
            </div>
          )}
          
          {serverInfo.actual_api_url && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Фактический URL API:</strong>
              <div style={{ wordBreak: 'break-all', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '3px' }}>
                {serverInfo.actual_api_url}
              </div>
            </div>
          )}
          
          {serverInfo.composers_count !== undefined && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Загружено композиторов:</strong> {serverInfo.composers_count}
            </div>
          )}
          
          {serverInfo.error && (
            <div style={{ marginBottom: '8px', color: '#ff6b6b' }}>
              <strong>Ошибка:</strong> {serverInfo.error}
            </div>
          )}
        </>
      )}
      
      <button 
        onClick={fetchServerInfo}
        style={{
          marginTop: '8px',
          padding: '6px 12px',
          fontSize: '11px',
          background: getStatusColor(),
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Обновить подключение
      </button>
    </div>
  );
};