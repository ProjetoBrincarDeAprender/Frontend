import styles from "./LateralMenu.module.css";
import profile from "../../assets/astronauta-profile.svg";

export function LateralMenu() {
  return (
    <div className={styles.menuContainer}>
      <img src={profile} alt="" />
      <h1>Teste</h1>
    </div>
  );
}
