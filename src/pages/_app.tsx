import React from "react";
import { AuthProvider } from ".././components/authContext";
import { LayoutProvider } from "../components/layoutContext";
import { UserDataProvider } from "../components/userDataContext";
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
        <UserDataProvider>
          <div className="flex">
            <NavBar />
            <Component {...pageProps} />
          </div>
        </UserDataProvider>
      </AuthProvider>
    </Provider>
    </LayoutProvider>
  );
};

export default App;
