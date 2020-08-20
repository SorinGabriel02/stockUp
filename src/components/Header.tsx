import React from "react";

import styles from "./Header.module.scss";

const Header = () => {
    return <header className={styles.mainHeader}>
        <h1>StockUp <span className={styles.arrow}>&#8605;</span></h1>
        <h2>Visualize Stock Prices</h2>
    </header>
}

export default Header;