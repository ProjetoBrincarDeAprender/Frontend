import styles from "./LateralMenu.module.css";
import profile from "../../assets/astronauta-profile.svg";

export function LateralMenu() {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.user}>
        <img
          src={profile}
          className="border-8 border-transparent outline-3 outline"
          alt=""
        />
        <span className={styles.username}>Usuario Usuario</span>
      </div>

      <ul className={styles.itens}>
        <li>
          <a href="dashboard/logistics">Logística</a>
        </li>
        <li>
          <a href="dashboard/students">Alunos</a>
        </li>
        <li>
          <a href="dashboard/teachers">Professores</a>
        </li>
        <li>
          <a href="dashboard/schools">Escolas</a>
        </li>
      </ul>
    </div>
  );
}
