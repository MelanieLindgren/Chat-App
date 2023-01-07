import { useState } from "react";

import "./App.css";
import SignIn from "./components/SignIn/SignIn";
import ChatRoom from "./components/ChatRoom/ChatRoom";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore } from "firebase/firestore";

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

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      {user ? (
        <ChatRoom firestore={firestore} auth={auth} />
      ) : (
        <SignIn firestore={firestore} auth={auth} />
      )}
    </>
  );
}

export default App;
