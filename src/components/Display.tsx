import React, { useState } from "react";
import Chart from "./Chart";

interface DisplayProps { }

interface Data {
    "Meta Data": object;
    "Time Series (Daily)": {
        [key: string]: {
            [key: string]: string;
        };
    };
}

const Display: React.FC<DisplayProps> = () => {
    const [xValues, setXValues] = useState<string[]>([]);
    const [yValues, setYValues] = useState<number[]>([]);

    const getData = async (): Promise<void> => {
        const apiKey = "RX7L8D2IIGC3AR5S";
        let stockSymbol = "IBM"
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&interval=5min&apikey=${apiKey}`
        try {
            const response = await fetch(url);
            const data: Data = await response.json();

            let mapXValues: string[] = [];
            let mapYValues: number[] = [];
            const dataObj = data["Time Series (Daily)"];

            for (let day in dataObj) {
                mapXValues.push(day);
                mapYValues.push(+dataObj[day]["1. close"])
            }
            setXValues(mapXValues);
            setYValues(mapYValues);
        } catch (error) {
            console.log(error);
        }
    }

    return <div>
        <button onClick={getData}>Get Data</button>
        <section>
            <Chart xValues={xValues} yValues={yValues} />
        </section>
    </div>
}

export default Display;