import React from 'react';
import MainLayout from "./layout/MainLayout";
import { AuthProvider } from '.././components/authContext';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import PatientDashboard from '../components/Patient/dashboard';
import DoctorDashboard from '../components/Doctor/dashboard';
import '../styles/globals.css'

const App: React.FC = () => {
  return (
  <Provider store={store}>
      <AuthProvider>
        <PatientDashboard />
      </AuthProvider>
  </Provider>
  );
};

export default App;
