import ChatMessage from "../ChatMessage/ChatMessage";
import styles from "./ChatRoom.module.scss";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { AppContext } from "../../App";
import {
	useHandleScrollBehavior,
	useInputButtonColor,
	useMessages,
} from "./utils";

export type Message = {
	createdAt: any;
	photoURL: string;
	text: string;
	uid: string;
	id: string;
};

function ChatRoom() {
	const [formValue, setFormValue] = useState("");

	const bottomDiv = useRef<null | HTMLDivElement>(null);
	const chatViewRef = useRef<null | HTMLDivElement>(null);

	const { auth, firestore } = useContext(AppContext);
	const messagesRef = collection(firestore, "messages");

	const { uid } = auth.currentUser!;

	const inputButtonColor = useInputButtonColor(firestore, uid);
	const messages = useMessages(messagesRef);
	const { isVisible, downButtonTop, handleScrollToBottomButton } =
		useHandleScrollBehavior({
			auth,
			bottomDiv,
			chatViewRef,
			messages,
		});

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

	return (
		<>
			<div className={styles.messages} ref={chatViewRef}>
				{messages &&
					messages.map((msg) => (
						<ChatMessage
							key={msg.id}
							message={msg}
							userColor={inputButtonColor}
							isFromCurrentUser={msg.uid === auth.currentUser?.uid}
						/>
					))}
				<div className={styles.bottomDiv} ref={bottomDiv}></div>
			</div>
			<div className={styles.sendMessageDownButtonContainer}>
				<button
					className={styles.arrowDownButton}
					onClick={handleScrollToBottomButton}
					style={{ top: downButtonTop }}
				>
					<Icon
						icon="material-symbols:arrow-downward-rounded"
						className={styles.arrowDownIcon}
					/>
				</button>
				<form
					onSubmit={sendMessage}
					className={`${!isVisible && styles.isNotVisible}`}
				>
					<input
						value={formValue}
						onChange={(e) => {
							setFormValue(e.target.value);
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
