import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  setDoc,
} from "firebase/firestore";
import { useContext } from "react";
import { AppContext } from "../../App";
import styles from "./SignIn.module.scss";

function SignIn() {
  const { auth, firestore } = useContext(AppContext);
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      if (getAdditionalUserInfo(result)?.isNewUser) {
        addUser();
      }
    });
  }

  async function addUser() {
    const { uid } = auth.currentUser!;
    const userRef = doc(firestore, "users", uid);

    let colorIndex = (
      await getCountFromServer(collection(firestore, "users"))
    ).data();
  }

  return (
    <>
      <div className={styles.signIn}>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </>
  );
}

export default SignIn;
