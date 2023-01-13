import ChatMessage from "../ChatMessage/ChatMessage";
import styles from "./ChatRoom.module.scss";

import {
	collection,
	query,
	orderBy,
	addDoc,
	serverTimestamp,
	onSnapshot,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { AppContext } from "../../App";
import {
	useHandleScrollDown,
	useInputButtonColor,
	useSetVisibility,
} from "./utils";

export type Message = {
	createdAt: any;
	photoURL: string;
	text: string;
	uid: string;
	id: string;
};

function ChatRoom() {
	const { auth, firestore } = useContext(AppContext);
	const bottomDiv = useRef<null | HTMLDivElement>(null);
	const chatViewRef = useRef<null | HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [formValue, setFormValue] = useState("");
	const { uid } = auth.currentUser!;
	const messagesRef = collection(firestore, "messages");
	const q = query(messagesRef, orderBy("createdAt"));
	const [downButtonTop, setDownButtonTop] = useState("");

	const inputButtonColor = useInputButtonColor(firestore, uid);
	const isVisible = useSetVisibility(bottomDiv, setDownButtonTop);
	useHandleScrollDown({
		auth,
		bottomDiv,
		chatViewRef,
		messages,
		setDownButtonTop,
	});

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
							{/* {isVisible} */}
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
