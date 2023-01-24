import { createContext, useEffect, useState } from "react";

import "./App.css";
import SignIn from "./components/SignIn/SignIn";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import Header from "./components/Header/Header";

import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { doc, Firestore, getFirestore } from "firebase/firestore";
import localforage from "localforage";

const firebaseConfig = {
	apiKey: "AIzaSyBfbHPyuPmZ-C-TOzxU2Y8HaXYnBnosABk",
	authDomain: "chat-app-efbbc.firebaseapp.com",
	projectId: "chat-app-efbbc",
	storageBucket: "chat-app-efbbc.appspot.com",
	messagingSenderId: "996075380073",
	appId: "1:996075380073:web:837c17efd43e1def79f1f8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);

type AppContextProps = {
	firestore: Firestore;
	auth: Auth;
	displayMessageTime: boolean;
	displayMessageName: boolean;
	toggleDisplayMessageTime: () => void;
	toggleDisplayMessageName: () => void;
};

const appContextInitialValues: AppContextProps = {
	firestore,
	auth,
	displayMessageName: false,
	displayMessageTime: false,
	toggleDisplayMessageName: () => {},
	toggleDisplayMessageTime: () => {},
};

export const AppContext = createContext<AppContextProps>(
	appContextInitialValues
);

function App() {
	const [user] = useAuthState(auth);
	const {
		toggleSetting: toggleDisplayMessageTime,
		setting: displayMessageTime,
	} = useCachedSetting("displayMessageTime");
	const {
		toggleSetting: toggleDisplayMessageName,
		setting: displayMessageName,
	} = useCachedSetting("displayMessageName");

	return (
		<AppContext.Provider
			value={{
				...appContextInitialValues,
				displayMessageName,
				displayMessageTime,
				toggleDisplayMessageName,
				toggleDisplayMessageTime,
			}}
		>
			{user ? (
				<>
					<Header />
					<ChatRoom />
				</>
			) : (
				<>
					<SignIn />
				</>
			)}
		</AppContext.Provider>
	);
}

export default App;

export function useCachedSetting(
	key: "displayMessageTime" | "displayMessageName"
) {
	const [setting, setSetting] = useState(false);

	useEffect(() => {
		localforage.getItem(key).then((cachedValue) => {
			if (cachedValue === true || cachedValue === false) {
				setSetting(cachedValue);
			}
		});
	}, []);

	async function toggleSetting() {
		localforage.setItem(key, !setting);
		setSetting((prevValue) => !prevValue);
	}

	return { toggleSetting, setting };
}
