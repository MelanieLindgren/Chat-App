import { Auth } from "firebase/auth";
import {
	CollectionReference,
	doc,
	DocumentData,
	Firestore,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { colors } from "../../utils";
import { Message } from "./ChatRoom";

export function useMessages(messagesRef: CollectionReference<DocumentData>) {
	const [messages, setMessages] = useState<Message[]>([]);
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
	return messages;
}

export function useInputButtonColor(firestore: Firestore, uid: string) {
	const [inputButtonColor, setInputButtonColor] = useState("");
	const userRef = doc(firestore, "users", uid);
	const { "0": user } = useDocumentData(userRef);

	useEffect(() => {
		if (user) {
			setInputButtonColor(colors[user.colorIndex]);
		}
	}, [user]);

	return inputButtonColor;
}

type UseHandleScrollDownProps = {
	messages: Message[];
	chatViewRef: React.MutableRefObject<HTMLDivElement | null>;
	bottomDiv: React.MutableRefObject<HTMLDivElement | null>;
	auth: Auth;
};

export function useHandleScrollBehavior({
	auth,
	bottomDiv,
	chatViewRef,
	messages,
}: UseHandleScrollDownProps) {
	const [firstScrollBottom, setFirstScrollBottom] = useState(false);
	const [downButtonTop, setDownButtonTop] = useState("");
	const [isVisible, setIsVisible] = useState(false);

	const options = {
		root: null,
		rootMargin: "0px",
		threshold: 1.0,
	};

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

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			const [entry] = entries;
			setIsVisible(entry.isIntersecting);
		}, options);
		if (bottomDiv.current) {
			observer.observe(bottomDiv.current);
		}
		if (isVisible) {
			setDownButtonTop("25px");
		}
		return () => {
			if (bottomDiv.current) {
				observer.unobserve(bottomDiv.current);
			}
		};
	}, [bottomDiv, options]);

	function handleScrollToBottomButton() {
		bottomDiv.current!.scrollIntoView({ behavior: "smooth" });
		setDownButtonTop("25px");
	}

	return { isVisible, downButtonTop, handleScrollToBottomButton };
}
