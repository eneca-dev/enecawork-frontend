/**
 * Сервис для управления идентификаторами устройств
 */

/**
 * Генерация уникального идентификатора устройства
 */
export const generateDeviceId = (): string => {
  return `${navigator.userAgent}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
};

/**
 * Получение идентификатора устройства из localStorage
 */
export const getDeviceId = (): string | null => {
  return localStorage.getItem('device_id');
};

/**
 * Сохранение идентификатора устройства в localStorage
 */
export const setDeviceId = (deviceId: string): void => {
  localStorage.setItem('device_id', deviceId);
}; 