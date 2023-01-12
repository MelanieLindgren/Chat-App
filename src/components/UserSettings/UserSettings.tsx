import { Auth } from "firebase/auth";
import { doc, Firestore, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { colors } from "../../utils";
import styles from "./UserSettings.module.scss";

type UserSettingsProps = {
  setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
  auth: Auth;
  firestore: Firestore;
  isSettingsOpen: boolean;
};

function UserSettings({
  auth,
  firestore,
  isSettingsOpen,
  setIsSettingsOpen,
}: UserSettingsProps) {
  const [nicknameValue, setNicknameValue] = useState("");
  const { uid } = auth.currentUser!;
  const userRef = doc(firestore, "users", uid);
  const { "0": user } = useDocumentData(userRef);
  const [nickname, setNickname] = useState("");
  const [userColor, setUserColor] = useState("");

  useEffect(() => {
    if (user) {
      setUserColor(colors[user.colorIndex]);
      setNickname(user.name);
      setNicknameValue(user.name);
    }
  }, [user, isSettingsOpen]);

  async function updateSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSettingsOpen(false);
    setNicknameValue("");
    if (!nicknameValue.trim()) {
      return;
    }
    await updateDoc(userRef, {
      colorIndex: colors.indexOf(userColor),
      name: nicknameValue,
    });
  }

  return (
    <div
      style={{
        top: `${isSettingsOpen ? "0" : "-100vh"}`,
      }}
      className={styles.userSettings}
    >
      <h1>{nickname}</h1>
      <form onSubmit={updateSettings}>
        <div className={styles.nicknameInput}>
          <p>Nickname</p>
          <input
            maxLength={10}
            value={nicknameValue}
            onChange={(e) => {
              setNicknameValue(e.target.value);
            }}
          />
        </div>
        <div className={styles.colorInput}>
          <p>Color</p>
          <div className={styles.radioButtons}>
            {colors.map((color) => (
              <div className={styles.radioButton}>
                <div
                  className={styles.border}
                  style={{
                    border: "4px solid" + color,
                  }}
                ></div>
                <input
                  onClick={() => {
                    setUserColor(color);
                  }}
                  type="radio"
                  name="color"
                  checked={userColor === color}
                ></input>
                <div
                  className={styles.dot}
                  style={{
                    backgroundColor: `${
                      userColor === color ? color : "#3B3B3B"
                    }`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserSettings;
