import { createContext, useState } from "react";

import "./App.css";
import SignIn from "./components/SignIn/SignIn";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import Header from "./components/Header/Header";

import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { doc, Firestore, getFirestore } from "firebase/firestore";
import UserSettings from "./components/UserSettings/UserSettings";

const firebaseConfig = {
  apiKey: "AIzaSyBfbHPyuPmZ-C-TOzxU2Y8HaXYnBnosABk",
  authDomain: "chat-app-efbbc.firebaseapp.com",
  projectId: "chat-app-efbbc",
  storageBucket: "chat-app-efbbc.appspot.com",
  messagingSenderId: "996075380073",
  appId: "1:996075380073:web:837c17efd43e1def79f1f8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);

type AppContextProps = {
  firestore: Firestore;
  auth: Auth;
};

const appContextValues: AppContextProps = {
  firestore,
  auth,
};

export const AppContext = createContext<AppContextProps>(appContextValues);

function App() {
  const [user] = useAuthState(auth);

  return (
    <AppContext.Provider value={appContextValues}>
      {user ? (
        <>
          <Header />
          <ChatRoom />
        </>
      ) : (
        <>
          <SignIn />
        </>
      )}
    </AppContext.Provider>
  );
}

export default App;
