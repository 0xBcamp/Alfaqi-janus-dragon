import React from "react";
import { AuthProvider } from "../components/Contexts/authContext";
import { UserDataProvider } from "../components/Contexts/userDataContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../styles/globals.css";
import { AppProps } from "next/app";
import NavBar from "../components/navBar";
import { XMTPProvider } from "../components/Consultation/chat/xmtpContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
    <UserDataProvider>
    <XMTPProvider>
    <AuthProvider> 
          <div className="flex">
            <NavBar />
            <Component {...pageProps} />
          </div>
    </AuthProvider>
    </XMTPProvider>
    </UserDataProvider>
        </Provider>
  );
};

export default App;
