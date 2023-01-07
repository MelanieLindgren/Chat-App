import {
  Auth,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  Firestore,
  getCountFromServer,
} from "firebase/firestore";
import styles from "./SignIn.module.scss";

type SignInProps = {
  firestore: Firestore;
  auth: Auth;
};

function SignIn({ firestore, auth }: SignInProps) {
  const userRef = collection(firestore, "users");

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
    let colorIndex = (await getCountFromServer(userRef)).data();
    await addDoc(userRef, {
      uid: uid,
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
