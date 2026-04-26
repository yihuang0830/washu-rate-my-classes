import { Link } from "react-router-dom";
import { getReviewFormUrl } from "../services/sheetsApi";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo}>WashU</span>
          <span className={styles.logoSub}>Rate My Classes</span>
        </Link>
        <div className={styles.actions}>
          <a
            href={getReviewFormUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
          >
            + 写评价
          </a>
        </div>
      </div>
    </nav>
  );
}
