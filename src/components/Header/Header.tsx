import { Icon } from "@iconify/react";
import { useContext, useState } from "react";
import styles from "./Header.module.scss";
import UserSettings from "../UserSettings/UserSettings";
import { boxShadow } from "../../utils";
import { AppContext } from "../../App";

function Header() {
	const { auth } = useContext(AppContext);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const [scrollY, setScrollY] = useState(0);

	if (!isSettingsOpen) {
		window.scrollTo(0, scrollY);
	} else {
	}

	return (
		<>
			<header
				className={styles.header}
				style={{
					boxShadow: `${isSettingsOpen ? "none" : boxShadow}`,
					transitionDelay: `${isSettingsOpen ? "" : "0.3s"}`,
				}}
			>
				<button
					onClick={() => {
						setIsSettingsOpen(!isSettingsOpen);
						if (!isSettingsOpen) {
							setScrollY(window.scrollY);
						}
					}}
					className={styles.userSettingsButton}
				>
					<Icon
						icon="quill:cog-alt"
						className={styles.userSettingsIcon}
						style={{
							transform: `rotateZ(${isSettingsOpen ? "60deg" : "0deg"})`,
						}}
					/>
				</button>
				<button onClick={() => auth.signOut()}>Sign Out</button>
			</header>
			<UserSettings
				setIsSettingsOpen={setIsSettingsOpen}
				isSettingsOpen={isSettingsOpen}
			/>
		</>
	);
}

export default Header;
