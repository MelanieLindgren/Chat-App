import { Icon } from "@iconify/react";
import { Auth } from "firebase/auth";
import { useState } from "react";
import styles from "./Header.module.scss";
import UserSettings from "../UserSettings/UserSettings";
import { Firestore } from "firebase/firestore";
import { boxShadow } from "../../utils";

type HeaderProps = {
  firestore: Firestore;
  auth: Auth;
};

function Header({ firestore, auth }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  console.log(window.scrollY);

  if (isSettingsOpen) {
    window.onscroll = function () {
      window.scrollTo(0, scrollY);
    };
  } else {
    window.onscroll = function () {};
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
            setScrollY(window.scrollY);
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
        firestore={firestore}
        auth={auth}
        isSettingsOpen={isSettingsOpen}
      />
    </>
  );
}

export default Header;
