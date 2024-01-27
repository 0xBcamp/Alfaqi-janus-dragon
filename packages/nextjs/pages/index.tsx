import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './_app';

function Main() {
  useEffect(() => {
    // This code will only run on the client side
    const rootElement = document.getElementById('root');
    ReactDOM.createRoot(rootElement as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }, []);

  return null; // Return null or an empty component on the server side
}

export default Main;