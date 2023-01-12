import { DocumentData, Firestore } from "firebase/firestore";
import styles from "./ChatMessage.module.scss";
import { useState } from "react";

type ChatMessageProps = {
  userColor: string;
  message: DocumentData;
  firestore: Firestore;
  isFromCurrentUser: boolean;
};

function ChatMessage({
  userColor,
  message,
  isFromCurrentUser,
}: ChatMessageProps) {
  const { text, createdAt } = message;
  const dateNow = new Date();
  let timestamp: Date | string = dateNow;
  let [showTime, setShowTime] = useState(false);

  function setTimestamp() {
    if (!createdAt) {
      timestamp = "now";
      return timestamp;
    }

    const date = createdAt.toDate() as Date;
    const time = date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date.getFullYear() !== dateNow.getFullYear()) {
      timestamp =
        date.toLocaleDateString("en-gb", { dateStyle: "medium" }) + " " + time;
    } else if (
      date.getMonth() !== dateNow.getMonth() ||
      date.getDate() < dateNow.getDate() - 6
    ) {
      timestamp =
        date.toLocaleDateString("en-gb", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }) +
        " " +
        time;
    } else if (
      time ===
      dateNow.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    ) {
      timestamp = "now";
    } else if (date.getDate() === dateNow.getDate()) {
      timestamp = "today" + " " + time;
    } else if (date.getDate() === dateNow.getDate() - 1) {
      timestamp = "yesterday" + " " + time; // funkar inte när date är/blir 0
    } else {
      timestamp =
        date.toLocaleDateString("en-gb", {
          weekday: "short",
        }) +
        " " +
        time;
    }

    return timestamp;
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
        {setTimestamp()}
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
