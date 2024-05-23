import React from 'react';
import styles from './NavBar.module.css';

const NavBar = ({scrollToRevealRooms}) => {
  return (
    <header className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}><a href="/houseowner" className={styles.navLink}>House Owner</a></li>
          <div className={styles.title}>
          <li className={styles.navItem}><a href="/houseowner" className={styles.navLink}>Home</a></li>
          <li className={styles.navItem}><a  className={styles.navLink}onClick={scrollToRevealRooms}>Rooms</a></li>
          <li className={styles.navItem}><a href="/login" className={styles.navLink}>Log Out</a></li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
