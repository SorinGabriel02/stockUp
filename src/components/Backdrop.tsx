import React from "react";

import styles from "./Backdrop.module.scss";

interface BackdropProps {
    onClick: () => void;
    show: boolean;
}

const Backdrop = ({ show, onClick }: BackdropProps) => {
    const handleClick = () => onClick();

    return <div className={styles.backdrop} style={{ display: show ? "block" : "none" }} onClick={handleClick}></div>
}

export default Backdrop;