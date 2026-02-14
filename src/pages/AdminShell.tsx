import React from 'react';
import Admin from './Admin';
import { ToastProvider } from '../context/ToastContext';

const AdminShell: React.FC = () => (
  <ToastProvider>
    <Admin />
  </ToastProvider>
);

export default AdminShell;
