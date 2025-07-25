import styles from "./LateralMenu.module.css";
import profile from "../../assets/astronauta-profile.svg";

export function LateralMenu() {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.user}>
        <img
          src={profile}
          className="border-4 border-transparent outline-2 outline-am0"
          alt=""
        />
        <span className={styles.username}>Usuario Usuario</span>
      </div>

      <ul className={styles.itens}>
        <li>
          <a href="">Logística</a>
        </li>
        <li>
          <a href="">Alunos</a>
        </li>
        <li>
          <a href="">Professores</a>
        </li>
        <li>
          <a href="">Escolas</a>
        </li>
      </ul>
    </div>
  );
}
