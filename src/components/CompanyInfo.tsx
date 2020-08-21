import React from "react";

import styles from "./CompanyInfo.module.scss";

interface InfoProps {
    currency: string;
    symbol: string;
}

const CompanyInfo = (props: InfoProps) => {
    return (
        <ul className={styles.info}>
            <li><p>{props.symbol}</p></li>
            <li><p>Currency: {props.currency}</p></li>
        </ul>
    )
}

export default CompanyInfo;