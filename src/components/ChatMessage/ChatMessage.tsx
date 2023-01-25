import { doc, DocumentData } from "firebase/firestore";
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

function ChatMessage({ message, isFromCurrentUser }: ChatMessageProps) {
	const { firestore, displayMessageName, displayMessageTime } =
		useContext(AppContext);
	const { text, createdAt, uid } = message;
	const [displayTime, setDisplayTime] = useState(false);
	const [displayName, setDisplayName] = useState(false);
	const [userColor, setUserColor] = useState("");
	const [userName, setUserName] = useState("");
	const dateNow = new Date();
	let timestamp: string = "";

	const userRef = doc(firestore, "users", uid);
	const { "0": user } = useDocumentData(userRef);

	useEffect(() => {
		if (user) {
			setUserColor(colors[user.colorIndex]);
			setUserName(user.name);
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
				setDisplayTime(!displayTime);
				setDisplayName(!displayName);
			}}
		>
			<div className={`${styles.timeContainer}`}>
				<p
					className={`${styles.time}`}
					style={{
						marginTop: `${
							displayMessageTime ? "0" : displayTime ? "0" : "50px"
						}`,
					}}
				>
					{timestamp}
				</p>
			</div>
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
				<p
					className={`${styles.userName} ${
						isFromCurrentUser && `${styles.currentUser}`
					}`}
					style={{
						bottom: `${
							displayMessageName ? "-20px" : displayName ? "-20px" : "15px"
						}`,
					}}
				>
					{userName}
				</p>
			</div>
		</div>
	);
}

export default ChatMessage;
