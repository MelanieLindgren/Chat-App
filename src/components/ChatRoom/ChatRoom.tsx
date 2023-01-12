import ChatMessage from "../ChatMessage/ChatMessage";
import styles from "./ChatRoom.module.scss";

import {
  collection,
  query,
  orderBy,
  Firestore,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
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
  const chatViewRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [firstScrollBottom, setFirstScrollBottom] = useState(false);
  const [formValue, setFormValue] = useState("");
  const { uid } = auth.currentUser!;
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  const [downButtonTop, setDownButtonTop] = useState("");

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

  useEffect(() => {
    if (messages.length > 0 && !firstScrollBottom) {
      setFirstScrollBottom(true);
      bottomDiv.current!.scrollIntoView();
    } else if (
      Math.abs(
        chatViewRef.current!.getBoundingClientRect().height +
          chatViewRef.current!.getBoundingClientRect().y
      ) <
      window.innerHeight * 2
    ) {
      bottomDiv.current!.scrollIntoView({ behavior: "smooth" });
    } else if (messages[messages.length - 1].uid !== auth.currentUser!.uid) {
      setDownButtonTop("-70px");
    }
  }, [messages]);

  const [isVisible, setIsVisible] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    }, options);
    if (bottomDiv.current) observer.observe(bottomDiv.current);
    return () => {
      if (bottomDiv.current) observer.unobserve(bottomDiv.current);
    };
  }, [bottomDiv, options]);

  function scrollToBottomButton() {
    bottomDiv.current!.scrollIntoView({ behavior: "smooth" });
    setDownButtonTop("25px");
  }

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormValue("");

    if (!formValue.trim()) {
      return;
    }

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
    });
  }

  const userRef = doc(firestore, "users", uid);
  const { "0": user } = useDocumentData(userRef);

  const [inputButtonColor, setInputButtonColor] = useState("");

  useEffect(() => {
    if (user) {
      setInputButtonColor(colors[user.colorIndex]);
    }
  }, [user]);

  return (
    <>
      <div className={styles.messages} ref={chatViewRef}>
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              firestore={firestore}
              userColor={inputButtonColor}
              isFromCurrentUser={msg.uid === auth.currentUser?.uid}
            />
          ))}
        <div className={styles.bottomDiv} ref={bottomDiv}></div>
      </div>
      <div className={styles.sendMessageDownButtonContainer}>
        <button
          className={styles.arrowDownButton}
          onClick={scrollToBottomButton}
          style={{ top: downButtonTop }}
        >
          <Icon
            icon="material-symbols:arrow-downward-rounded"
            className={styles.arrowDownIcon}
          />
        </button>
        <div
          className={`${styles.sendMessageContainer} ${
            !isVisible && styles.isNotVisible
          }`}
        >
          <form onSubmit={sendMessage}>
            <input
              value={formValue}
              onChange={(e) => {
                setFormValue(e.target.value);
              }}
            />
            <button style={{ backgroundColor: inputButtonColor }} type="submit">
              {isVisible}
              <Icon
                icon="material-symbols:arrow-upward-rounded"
                className={styles.inputIcon}
              />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
