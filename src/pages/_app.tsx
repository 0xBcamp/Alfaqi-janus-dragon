import React from "react";
import { AuthProvider } from ".././components/authContext";
import { LayoutProvider } from "../components/layoutContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import { AppProps } from "next/app";
import NavBar from "../components/navBar";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LayoutProvider>
    <Provider store={store}>
      <AuthProvider>
        <div className="flex">
          <NavBar />
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </Provider>
    </LayoutProvider>
  );
};

export default App;
