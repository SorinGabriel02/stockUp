import React from "react";

import styles from "./ChartNav.module.scss";

interface ChartNavProps {
    dataChunk: "lastDay" | "fiveDays" | "oneMonth" | "threeMonths" | "sixMonths" | "oneYear" | "maximum";
    handleRequest: (chunk: string) => void;
}

const ChartNav = ({ dataChunk, handleRequest }: ChartNavProps) => {
    const handleClick = (value: string) => {
        if (value === dataChunk) return;
        handleRequest(value);
    }

    return <ul className={styles.navContainer}>
        <li onClick={() => handleClick("lastDay")} className={Boolean(dataChunk === "lastDay") ? styles.active : ""}>1 Day</li>
        <li onClick={() => handleClick("fiveDays")} className={Boolean(dataChunk === "fiveDays") ? styles.active : ""}>5 Days</li>
        <li onClick={() => handleClick("oneMonth")} className={Boolean(dataChunk === "oneMonth") ? styles.active : ""}>1 Month</li>
        <li onClick={() => handleClick("threeMonths")} className={Boolean(dataChunk === "threeMonths") ? styles.active : ""}>3 Months</li>
        <li onClick={() => handleClick("sixMonths")} className={Boolean(dataChunk === "sixMonths") ? styles.active : ""}>6 Months</li>
        <li onClick={() => handleClick("oneYear")} className={Boolean(dataChunk === "oneYear") ? styles.active : ""}>1 Year</li>
        <li onClick={() => handleClick("maximum")} className={Boolean(dataChunk === "maximum") ? styles.active : ""}>Full</li>
    </ul>
}

export default ChartNav;