import { Auth } from "firebase/auth";
import { doc, Firestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { colors } from "../../utils";
import { Message } from "./ChatRoom";

type UseHandleScrollDownProps = {
	messages: Message[];
	chatViewRef: React.MutableRefObject<HTMLDivElement | null>;
	bottomDiv: React.MutableRefObject<HTMLDivElement | null>;
	auth: Auth;
	setDownButtonTop: React.Dispatch<React.SetStateAction<string>>;
};

export function useHandleScrollDown({
	auth,
	bottomDiv,
	chatViewRef,
	messages,
	setDownButtonTop,
}: UseHandleScrollDownProps) {
	const [firstScrollBottom, setFirstScrollBottom] = useState(false);
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

export function useSetVisibility(
	bottomDiv: React.MutableRefObject<HTMLDivElement | null>,
	setDownButtonTop: React.Dispatch<React.SetStateAction<string>>
) {
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
	return isVisible;
}
