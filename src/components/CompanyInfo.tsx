import React from "react";

import styles from "./CompanyInfo.module.scss";

interface InfoProps {
    info: {
        Name: string;
        prevClose: string;
        Currency: string;
        Exchange: string;
        Symbol: string;
        "52WeekHigh": string;
        "52WeekLow": string;
        "50DayMovingAverage": string;
        "200DayMovingAverage": string;
    };
}

const CompanyInfo = ({ info }: InfoProps) => {
    const high = Number(info["52WeekHigh"]).toFixed(2);
    const low = Number(info["52WeekLow"]).toFixed(2);
    const fiftyMA = Number(info["50DayMovingAverage"]).toFixed(2);
    const twoHundredMA = Number(info["200DayMovingAverage"]).toFixed(2);

    return (
        <div className={styles.info}>
            <div className={styles.infoHeading}>
                <h3>{info.Name}</h3>
                <h3 className={styles.price}>{info.prevClose + " " + info.Currency}<span>(previous close)</span></h3>
            </div>
            <ul>
                <li><p>{info.Exchange}:{info.Symbol}</p></li>
                <li><p>52week High: {high} </p></li>
                <li><p>52week Low: {low}</p></li>
                <li><p>50Day MA: {fiftyMA}</p></li>
                <li><p>200Day MA: {twoHundredMA}</p></li>
            </ul>
        </div>
    )
}

export default CompanyInfo;