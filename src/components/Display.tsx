import React, { useReducer, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import styles from "./Display.module.scss";

import { MappedDataObj } from "../interfaces/MappedDataObj";
import Chart from "./Chart";
import CompanyInfo from "./CompanyInfo";
import Backdrop from "./Backdrop";
import Modal from "./Modal";
import ChartNav from "./ChartNav";

interface DisplayProps { }

interface Data {
    "Meta Data": object;
    "Time Series (15min)"?: {
        [key: string]: {
            [key: string]: string;
        };
    };
    "Time Series (Daily)"?: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

interface StateObj {
    isLoading: boolean;
    chartData: MappedDataObj[];
    symbol: string;
    companyInfo: object;
    lastDay: Data | {};
    daily: Data | {};
    errorMessage: string;
    dataChunk: "lastDay" | "fiveDays" | "oneMonth" | "threeMonths" | "sixMonths" | "oneYear" | "maximum";
}

interface ActionObj {
    type: string;
    payload: any;
}

const initialState: StateObj = {
    isLoading: false,
    lastDay: {},
    daily: {},
    chartData: [],
    companyInfo: {},
    symbol: "",
    errorMessage: "",
    dataChunk: "lastDay"
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
                companyInfo: {
                    ...state.companyInfo,
                    ...action.payload
                }
            }
        case "dataChunk": {
            return {
                ...state,
                dataChunk: action.payload
            }
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
    const apiKey = "asdfasdfasdf";
    const inputRef = useRef<HTMLInputElement>(null);
    const [state, dispatch] = useReducer(displayReducer, initialState);

    const mapDataChunk = (dataArray: MappedDataObj[]) => {
        dispatch({ type: "chartData", payload: dataArray });
    };

    const handleRequest = useCallback(async (chunk: string) => {
        const oneDayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${state.companyInfo.Symbol || state.symbol}&interval=15min&apikey=${apiKey}`;
        const fiveDaysUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${state.companyInfo.Symbol}&interval=60min&apikey=${apiKey}`;
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${state.companyInfo.Symbol}&apikey=${apiKey}`
        dispatch({ type: "dataChunk", payload: chunk });
        try {
            let response;
            switch (chunk) {
                case "lastDay": {
                    response = await axios.get(oneDayUrl);
                    console.log(response.data);
                    if (!response.data["Time Series (15min)"] || !response.data || response.data.note) {
                        dispatch({ type: "errorMessage", payload: "Data could not be retrieved. Please try again later" });
                    }
                    let dataToMap = [];
                    for (let key in response.data["Time Series (15min)"]) {
                        dataToMap
                            .push({ date: new Date(key), value: +response.data["Time Series (15min)"][key]["4. close"] });
                    }
                    // get the last day (previous day) from the response and filter array
                    const maxDate = new Date(response.data["Meta Data"]["3. Last Refreshed"]);

                    dataToMap = dataToMap.filter(entry => entry.date.getDate() === maxDate.getDate());
                    mapDataChunk(dataToMap);
                    break;
                }
                case "fiveDays": {
                    response = await axios.get(fiveDaysUrl);
                    if (!response.data["Time Series (60 min)"] || !response.data || response.data.note) {
                        dispatch({ type: "errorMessage", payload: "Data for the last five days could not be retrieved. Please try again later" });
                    }
                    console.log(response.data);
                    break;
                }
                default:
                    return;
            }
        } catch (e) {
            dispatch({ type: "errorMessage", payload: e.message })
        }
    }, [state.companyInfo.Symbol, state.symbol])

    const getData = useCallback(async (event): Promise<void> => {
        event.preventDefault();
        const infoUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.symbol}&apikey=${apiKey}`;
        const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${state.symbol}&apikey=lajsdalksdjd`; // check key later
        try {
            const infoResponse = await axios.get(infoUrl);
            const quoteResponse = await axios.get(quoteUrl);
            if (infoResponse.data.Note || quoteResponse.data.Note) {
                console.log(infoResponse.data, quoteResponse.data);
                return dispatch({ type: "errorMessage", payload: "Server error. Please try again later." })
            }
            if (!infoResponse.data.Symbol || !quoteResponse.data["Global Quote"]) {
                return dispatch({ type: "errorMessage", payload: `We could not find any data for "${state.symbol}". Please check your input and try again.` })
            }
            dispatch({ type: "companyInfo", payload: { ...infoResponse.data, ...quoteResponse.data["Global Quote"] } });
        } catch (error) {
            dispatch({ type: "errorMessage", payload: error.message })
        }
        dispatch({ type: "symbol", payload: "" });
    }, [state.symbol]);

    const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        return dispatch({ type: "symbol", payload: event.target.value });
    };

    const handleSymbolSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        getData(event);
        handleRequest("lastDay");
    }

    const clearErrorMessage = () => {
        dispatch({ type: "errorMessage", payload: "" })
    }

    useEffect(() => {
        // focus on input on page load
        const node = inputRef.current;
        if (node) node.focus();
    }, [])

    return (<main>
        <Backdrop show={!!state.errorMessage} onClick={clearErrorMessage} />
        <Modal show={!!state.errorMessage} ><p>{state.errorMessage}</p>
            <button
                className={styles.searchBtn}
                onClick={clearErrorMessage}
            >Close</button>
        </Modal>
        <form className={styles.searchForm} onSubmit={e => handleSymbolSubmit(e)}>
            <input
                ref={inputRef}
                required
                maxLength={20}
                type="text"
                value={state.symbol}
                onChange={e => handleSymbolChange(e)} placeholder="Company symbol..."
            />
            <button className={styles.searchBtn}>Search</button>
        </form>
        <section className={styles.chartContainer}>
            {state.companyInfo.Symbol ?
                <React.Fragment >
                    <ChartNav
                        handleRequest={handleRequest}
                        dataChunk={state.dataChunk}
                    />
                    <Chart data={state.chartData} />
                    <CompanyInfo
                        info={state.companyInfo}
                    />
                </React.Fragment > :
                <p style={{ textAlign: "center" }}>Search by company symbol to visualize stock data</p>}
        </section>
    </main >)
}

export default Display;