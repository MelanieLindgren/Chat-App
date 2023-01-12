import {
  Auth,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  Firestore,
  getCountFromServer,
  setDoc,
} from "firebase/firestore";
import styles from "./SignIn.module.scss";

type SignInProps = {
  firestore: Firestore;
  auth: Auth;
};

function SignIn({ firestore, auth }: SignInProps) {
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
    await setDoc(userRef, {
      colorIndex: colorIndex.count++,
    });
  }

  return (
    <div className={styles.signIn}>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default SignIn;
