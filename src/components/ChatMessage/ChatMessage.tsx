import {
  collection,
  doc,
  DocumentData,
  Firestore,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AppContext } from "../../App";
import { colors } from "../../utils";
import styles from "./ChatMessage.module.scss";
import { setTimestamp } from "./utils";

type ChatMessageProps = {
  userColor: string;
  message: DocumentData;
  isFromCurrentUser: boolean;
};

function ChatMessage({
  // userColor,
  message,
  isFromCurrentUser,
}: ChatMessageProps) {
  const { firestore } = useContext(AppContext);
  const { text, createdAt, uid } = message;
  const [showTime, setShowTime] = useState(false);
  const [userColor, setUserColor] = useState("");
  const dateNow = new Date();
  let timestamp: string = "";

  const userRef = doc(firestore, "users", uid);
  const { "0": user } = useDocumentData(userRef);

  useEffect(() => {
    if (user) {
      setUserColor(colors[user.colorIndex]);
    }
  }, [user]);

  if (!createdAt) {
    timestamp = "now";
  } else {
    const date = createdAt.toDate() as Date;
    timestamp = setTimestamp(date, dateNow, timestamp);
  }

  return (
    <div
      className={styles.messageContainer}
      onClick={() => {
        setShowTime(!showTime);
      }}
    >
      <p
        className={`${styles.time}`}
        style={{
          marginBottom: `${showTime ? "0" : "-50px"}`,
        }}
      >
        {timestamp}
      </p>
      <div
        className={`${styles.message} ${
          isFromCurrentUser && `${styles.currentUser}`
        }`}
      >
        <p
          style={{ boxShadow: "4px 4px" + userColor }}
          className={styles.chatText}
        >
          {text}
        </p>
        <div className={styles.chatTriangle}></div>
        <div
          className={styles.chatTriangleShadow}
          style={{ borderTop: "20px solid" + userColor }}
        ></div>
      </div>
    </div>
  );
}

export default ChatMessage;
