import React from "react";

import styles from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.appFooter}>
            <p><sup>&copy;</sup>StockUp 2020</p>
        </footer>
    )
}

export default Footer;