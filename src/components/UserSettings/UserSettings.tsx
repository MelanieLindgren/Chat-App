import styles from "./UserSettings.module.scss";

type UserSettingsProps = {
  isSettingsOpen: boolean;
};

function UserSettings({ isSettingsOpen }: UserSettingsProps) {
  return (
    <div
      style={{ top: `${isSettingsOpen ? "0" : "-100vh"}` }}
      className={styles.userSettings}
    >
      <div>hej</div>
    </div>
  );
}

export default UserSettings;
