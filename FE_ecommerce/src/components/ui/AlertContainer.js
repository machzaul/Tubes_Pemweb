import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const AlertContainer = ({ alerts, onRemoveAlert }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {alerts.map((alert, index) => (
        <Alert
          key={alert.id}
          variant={alert.variant}
          show={true}
          onClose={() => onRemoveAlert(alert.id)}
          autoClose={alert.autoClose}
          duration={alert.duration}
          className={`transform transition-all duration-300 ease-in-out delay-${index * 100}`}
        >
          {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
          {alert.message && <AlertDescription>{alert.message}</AlertDescription>}
        </Alert>
      ))}
    </div>
  );
};

export default AlertContainer;