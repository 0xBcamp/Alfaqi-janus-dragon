import React from 'react';
import MainLayout from "./layout/MainLayout";
import { routes } from "../routes";
import { AuthProvider } from '.././components/authContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const App: React.FC = () => {
  return (
  <Provider store={store}>
    <StaticRouter>
      <AuthProvider>
        <Routes>
          {/* Define the root path with MainLayout as the element. */}
          <Route path="/" element={<MainLayout />}>
            {/* Spread the dynamically generated routes here */}
            {routes}
          </Route>
        </Routes>
      </AuthProvider>
    </StaticRouter>
  </Provider>
  );
};

export default App;
