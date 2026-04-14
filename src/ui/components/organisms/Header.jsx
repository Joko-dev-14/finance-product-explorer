import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <img src="/moneybox_logo.png" alt="Moneybox" className={styles.logo} />
      </div>
    </header>
  );
}
