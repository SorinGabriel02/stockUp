import React, { useReducer, useEffect, useCallback } from "react";
import axios from "axios";

import styles from "./Display.module.scss";

import { MappedDataObj } from "../interfaces/MappedDataObj";
import Chart from "./Chart";
import Backdrop from "./Backdrop";
import Modal from "./Modal";

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
    errorMessage: string;
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
    errorMessage: ""
}

const displayReducer = (state: StateObj, action: ActionObj) => {
    switch (action.type) {
        case "isLoading":
            return {
                ...state,
                isLoading: action.payload
            }
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
        case "companyInfo":
            return {
                ...state,
                companyInfo: action.payload
            }
        case "errorMessage":
            return {
                ...state,
                errorMessage: action.payload
            }
        default:
            return state;
    }
}

const Display: React.FC<DisplayProps> = () => {
    const [state, dispatch] = useReducer(displayReducer, initialState);

    const getData = useCallback(async (event): Promise<void> => {
        event.preventDefault();
        const apiKey = "asdfasdfasdf";
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${state.symbol}&apikey=${apiKey}`
        const infoUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.symbol}&apikey=${apiKey}`
        const todayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${state.symbol}&interval=15min&apikey=${apiKey}`;
        try {
            const infoResponse = await axios.get(infoUrl);
            console.log(infoResponse);
            if (infoResponse.data.Note) {
                return dispatch({ type: "errorMessage", payload: "Server error. Please try again later." })
            }
            if (!infoResponse.data.Symbol) {
                return dispatch({ type: "errorMessage", payload: `We could not find any data for "${state.symbol}". Please check your input and try again.` })
            }
            dispatch({ type: "companyInfo", payload: infoResponse.data });

            const dailyResponse = await axios.get(dailyUrl);

            //const intraDayResponse = await axios.get(todayUrl);
            //console.log(intraDayResponse.data);

            const data: Data = await dailyResponse.data;
            let mappedData: MappedDataObj[] | [] = [];
            for (let key in data["Time Series (Daily)"]) {
                mappedData = [...mappedData, {
                    date: new Date(key),
                    value: +data["Time Series (Daily)"][key]["4. close"]
                }]
            }
            dispatch({ type: "symbol", payload: "" });

            dispatch({ type: "chartData", payload: mappedData });
        } catch (error) {
            console.log(error);
        }
    }, [state.symbol]);

    const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        return dispatch({ type: "symbol", payload: event.target.value });
    };

    const clearErrorMessage = () => {
        dispatch({ type: "errorMessage", payload: "" })
    }

    const infoGraphic = state.companyInfo && <p>{state.companyInfo.Name}</p>

    console.log(state.companyInfo)

    return (<main>
        <Backdrop show={!!state.errorMessage} onClick={clearErrorMessage} />
        <Modal show={!!state.errorMessage} ><p>{state.errorMessage}</p>
            <button className={styles.searchBtn} onClick={clearErrorMessage}>Close</button>
        </Modal>
        <form className={styles.searchForm} onSubmit={e => getData(e)}>
            <input required maxLength={20} type="text" value={state.symbol} onChange={e => handleSymbolChange(e)} placeholder="Company symbol..." />
            <button className={styles.searchBtn}>Search</button>
        </form>
        <section className={styles.chartContainer}>
            <div className={styles.info}>{infoGraphic}</div>
            <Chart data={state.chartData} />
            <div className={styles.companyData}>Company Data here</div>
        </section>
    </main>)
}

export default Display;