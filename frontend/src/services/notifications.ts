import { toast } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';

const baseOptions: ToastOptions = {
  duration: 5000,
  position: 'top-right',
  style: {
    background: '#0f172a',
    color: '#f8fafc',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  iconTheme: {
    primary: '#22c55e',
    secondary: '#0f172a',
  },
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    ...baseOptions,
    icon: '✅',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    ...baseOptions,
    duration: 7000,
    icon: '⚠️',
  });
};

export const showWarning = (message: string) => {
  toast(message, {
    ...baseOptions,
    duration: 6000,
    icon: '⚠️',
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    ...baseOptions,
    icon: 'ℹ️',
  });
};
