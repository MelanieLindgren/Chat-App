import { Auth } from "firebase/auth";
import styles from "./Header.module.scss";

type HeaderProps = {
  auth: Auth;
};

function Header({ auth }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </header>
  );
}

export default Header;
