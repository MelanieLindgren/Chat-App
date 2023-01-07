import { collection, DocumentData, Firestore } from "firebase/firestore";
import styles from "./ChatMessage.module.scss";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { colors } from "../../utils/index";

type ChatMessageProps = {
  message: DocumentData;
  firestore: Firestore;
  isFromCurrentUser: boolean;
};

function ChatMessage({
  message,
  firestore,
  isFromCurrentUser,
}: ChatMessageProps) {
  const { text, photoURL, uid } = message;

  const usersRef = collection(firestore, "users");
  const [users] = useCollectionData(usersRef);
  let userColor = "";

  users?.forEach((user) => {
    if (user.uid == uid) {
      userColor = colors[user.colorIndex];
    }
  });

  return (
    <div
      className={`${styles.message} ${
        isFromCurrentUser && `${styles.currentUser}`
      }`}
    >
      <>
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
      </>
    </div>
  );
}

export default ChatMessage;
