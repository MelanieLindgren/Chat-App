import { doc, setDoc, updateDoc } from "firebase/firestore";
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AppContext } from "../../App";
import { colors } from "../../utils";
import styles from "./UserSettings.module.scss";

type UserSettingsProps = {
	setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
	isSettingsOpen: boolean;
};

function UserSettings({
	isSettingsOpen,
	setIsSettingsOpen,
}: UserSettingsProps) {
	const [nicknameValue, setNicknameValue] = useState("");
	const {
		auth,
		firestore,
		displayMessageName,
		displayMessageTime,
		toggleDisplayMessageName,
		toggleDisplayMessageTime,
	} = useContext(AppContext);
	const { uid } = auth.currentUser!;
	const userRef = doc(firestore, "users", uid);
	const { "0": user } = useDocumentData(userRef);
	const [userColor, setUserColor] = useState("");

	useEffect(() => {
		if (user) {
			setUserColor(colors[user.colorIndex]);
			setNicknameValue(user.name);
		} else {
			setUserColor(colors[0]);
			setNicknameValue("user");
		}
	}, [user, isSettingsOpen]);

	async function updateSettings(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSettingsOpen(false);
		setNicknameValue("");
		if (!nicknameValue.trim()) {
			return;
		}
		if (user) {
			await updateDoc(userRef, {
				colorIndex: colors.indexOf(userColor),
				name: nicknameValue,
			});
		} else {
			await setDoc(userRef, {
				colorIndex: colors.indexOf(userColor),
				name: nicknameValue,
			});
		}
	}

	return (
		<div
			style={{
				top: `${isSettingsOpen ? "0" : "-100vh"}`,
			}}
			className={styles.userSettings}
		>
			<h1>{nicknameValue}</h1>
			<form onSubmit={updateSettings}>
				<div className={`${styles.inputContainer} ${styles.nicknameInput}`}>
					<p>Nickname</p>
					<input
						maxLength={15}
						value={nicknameValue}
						onChange={(e) => {
							setNicknameValue(e.target.value);
						}}
					/>
				</div>
				<div className={`${styles.inputContainer} ${styles.colorInput}`}>
					<p>Color</p>
					<div className={styles.radioButtons}>
						{colors.map((color) => (
							<div
								key={colors.indexOf(color)}
								className={styles.radioButton}
								onClick={() => {
									setUserColor(color);
								}}
							>
								<div
									className={styles.border}
									style={{
										border: "0.25rem solid" + color,
									}}
								></div>
								<div
									className={styles.input}
									onClick={() => {
										setUserColor(color);
									}}
								></div>
								<div
									className={styles.dot}
									style={{
										backgroundColor: `${
											userColor === color ? color : "#303030"
										}`,
									}}
								></div>
							</div>
						))}
					</div>
				</div>
				<div
					className={`${styles.inputContainer} ${styles.showInputContainer}`}
				>
					<p>Display</p>
					<div className={styles.showTimeAndNameInput}>
						<div>
							<p>time</p>
							<div
								className={styles.switch}
								onChange={toggleDisplayMessageTime}
							>
								<input type="checkbox" checked={displayMessageTime} />
								<div className={styles.slider}></div>
							</div>
						</div>
						<div>
							<p>name</p>
							<div
								className={styles.switch}
								onChange={toggleDisplayMessageName}
							>
								<input type="checkbox" checked={displayMessageName} />
								<div className={styles.slider}></div>
							</div>
						</div>
					</div>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default UserSettings;
