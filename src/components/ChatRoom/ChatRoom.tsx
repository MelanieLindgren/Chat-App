import ChatMessage from "../ChatMessage/ChatMessage";
import Header from "../Header/Header";
import styles from "./ChatRoom.module.scss";

import {
  collection,
  query,
  orderBy,
  Firestore,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Auth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../utils";
import { Icon } from "@iconify/react";

type ChatRoomProps = {
  firestore: Firestore;
  auth: Auth;
};

type Message = {
  createdAt: any;
  photoURL: string;
  text: string;
  uid: string;
  id: string;
};

function ChatRoom({ firestore, auth }: ChatRoomProps) {
  const bottomDiv = useRef<null | HTMLDivElement>(null);
  const messagesViewRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ ...doc.data(), id: doc.id } as Message);
      });
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [formValue, setFormValue] = useState("");
  //   let isTypingBool = false;

  //   function isTyping() {
  //     let oldValue = formValue;
  //     console.log("Skriver");
  //     isTypingBool = true;
  //     const isTypingInterval = setTimeout(() => {
  //       if (oldValue === formValue) {
  //         isTypingBool = false;
  //         return () => clearTimeout(isTypingInterval);
  //       }
  //     }, 5000);
  //   }

  useEffect(() => {
    console.log(
      messagesViewRef.current?.offsetHeight,
      window.innerHeight,
      document.body.scrollHeight
    );
    if (window.performance) {
      if (performance.navigation.type == 1) {
        bottomDiv.current!.scrollIntoView();
      } else {
        bottomDiv.current!.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormValue("");

    if (!formValue.trim()) {
      return;
    }

    const { uid, photoURL } = auth.currentUser!;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    // bottomDiv.current!.scrollIntoView({ behavior: "smooth" });
  }

  const usersRef = collection(firestore, "users");
  const [users] = useCollectionData(usersRef);
  let inputButtonColor = "";

  users?.forEach((user) => {
    if (user.uid == auth.currentUser!.uid) {
      inputButtonColor = colors[user.colorIndex];
    }
  });

  return (
    <>
      <Header auth={auth} />
      <div className={styles.messages} ref={messagesViewRef}>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              firestore={firestore}
              isFromCurrentUser={msg.uid === auth.currentUser?.uid}
            />
          ))}
        <div ref={bottomDiv}></div>
      </div>
      <div className={styles.form}>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => {
              setFormValue(e.target.value);
              //   isTyping();
            }}
          />
          <button style={{ backgroundColor: inputButtonColor }} type="submit">
            <Icon
              icon="material-symbols:arrow-upward-rounded"
              className={styles.inputIcon}
            />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatRoom;
