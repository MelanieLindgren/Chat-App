import { Icon } from "@iconify/react";
import { Auth } from "firebase/auth";
import { useState } from "react";
import styles from "./Header.module.scss";
import UserSettings from "../UserSettings/UserSettings";

type HeaderProps = {
  auth: Auth;
};

function Header({ auth }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const boxShadow =
    "0px 0.4px 2.2px rgba(0, 0, 0, 0.02), 0px 1px 5.3px rgba(0, 0, 0, 0.028), 0px 1.9px 10px rgba(0, 0, 0, 0.035), 0px 3.4px 17.9px rgba(0, 0, 0, 0.042), 0px 6.3px 33.4px rgba(0, 0, 0, 0.05), 0px 15px 80px rgba(0, 0, 0, 0.07)";

  return (
    <>
      <header
        className={styles.header}
        style={{ boxShadow: `${isSettingsOpen ? "none" : boxShadow}` }}
      >
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
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
      <UserSettings isSettingsOpen={isSettingsOpen} />
    </>
  );
}

export default Header;
