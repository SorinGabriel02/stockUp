import React, { useReducer, useCallback } from "react";
import axios from "axios";

import { MappedDataObj } from "../interfaces/MappedDataObj";
import Chart from "./Chart";

import styles from "./Display.module.scss";

interface DisplayProps { }

interface Data {
    "Meta Data": object;
    "Time Series (Daily)": {
        [key: string]: {
            [key: string]: string;
        };
    };
}

interface StateObj {
    isLoading: boolean;
    chartData: MappedDataObj[];
    getDaily: boolean;
    symbol: string;
    companyInfo: object;
}

interface ActionObj {
    type: string;
    payload: any;
}

const initialState: StateObj = {
    isLoading: false,
    chartData: [],
    companyInfo: {},
    getDaily: true,
    symbol: "",

}

const displayReducer = (state: StateObj, action: ActionObj) => {
    switch (action.type) {
        case "symbol":
            return {
                ...state,
                symbol: action.payload
            }
        case "chartData":
            return {
                ...state,
                chartData: action.payload
            }
        default:
            return state;
    }
}

const Display: React.FC<DisplayProps> = () => {
    const [state, dispatch] = useReducer(displayReducer, initialState);

    const getData = useCallback(async (event): Promise<void> => {
        event.preventDefault();
        const apiKey = "RX7L8D2IIGC3AR5S";
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${state.symbol}&apikey=${apiKey}`
        const infoUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.symbol}&apikey=${apiKey}`
        const todayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${state.symbol}&interval=30min&apikey=${apiKey}`;
        try {
            // const infoResponse = await axios.get(infoUrl);
            // console.log(infoResponse.data);
            const dailyResponse = await axios.get(dailyUrl);
            console.log(dailyResponse);
            // const todayResponse = await axios.get(todayUrl);
            // console.log(todayResponse.data);
            const data: Data = await dailyResponse.data;
            let mappedData: MappedDataObj[] | [] = [];
            for (let key in data["Time Series (Daily)"]) {
                mappedData = [...mappedData, {
                    date: new Date(key),
                    value: +data["Time Series (Daily)"][key]["4. close"]
                }]
            }
            dispatch({ type: "symbol", payload: "" });
            dispatch({ type: "chartData", payload: mappedData })
        } catch (error) {
            console.log(error);
        }
    }, [state.symbol]);

    const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        return dispatch({ type: "symbol", payload: event.target.value });
    };

    return (<main>
        <form className={styles.searchForm} onSubmit={e => getData(e)}>
            <input required maxLength={20} type="text" value={state.symbol} onChange={e => handleSymbolChange(e)} placeholder="Company symbol..." />
            <button className={styles.searchBtn}>Search</button>
        </form>
        <section className={styles.chartContainer}>
            <Chart data={state.chartData} />
            <div className={styles.companyData}>Company Data here</div>
        </section>
    </main>)
}

export default Display;