import React, { useState } from "react";

import { MappedDataObj } from "../interfaces/MappedDataObj";
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
    const [chartData, setChartData] = useState<MappedDataObj[] | []>([]);

    const getData = async (): Promise<void> => {
        const apiKey = "RX7L8D2IIGC3AR5S";
        let stockSymbol = "IBM"
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&interval=5min&apikey=${apiKey}`
        try {
            const response = await fetch(url);
            const data: Data = await response.json();
            let mappedData: MappedDataObj[] | [] = [];

            for (let key in data["Time Series (Daily)"]) {
                mappedData = [...mappedData, {
                    date: new Date(key),
                    value: +data["Time Series (Daily)"][key]["4. close"]
                }]
            }
            setChartData(mappedData);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(chartData);

    return <div>
        <button onClick={getData}>Get Data</button>
        <section>
            <Chart data={chartData} />
        </section>
    </div>
}

export default Display;