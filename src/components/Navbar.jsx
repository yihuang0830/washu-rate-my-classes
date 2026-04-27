import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>WashU</span>
          <span className={styles.logoSub}>Rate My Classes</span>
        </Link>
      </div>
    </nav>
  );
}
