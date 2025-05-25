import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((alert) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      variant: 'success',
      duration: 3000,
      autoClose: true,
      ...alert,
    };

    setAlerts(prev => [...prev, newAlert]);

    if (newAlert.autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }

    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = "Success!") => {
    return showAlert({
      variant: 'success',
      title,
      message,
    });
  }, [showAlert]);

  const showError = useCallback((message, title = "Error!") => {
    return showAlert({
      variant: 'error',
      title,
      message,
    });
  }, [showAlert]);

  const showWarning = useCallback((message, title = "Warning!") => {
    return showAlert({
      variant: 'warning',
      title,
      message,
    });
  }, [showAlert]);

  const showInfo = useCallback((message, title = "Info") => {
    return showAlert({
      variant: 'info',
      title,
      message,
    });
  }, [showAlert]);

  return {
    alerts,
    showAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useAlert;