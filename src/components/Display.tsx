import React, { useReducer, useEffect, useCallback } from "react";
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
    intraDay: Data | {};
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
    intraDay: {},
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


    const [state, dispatch] = useReducer(displayReducer, initialState);

    const mapDataChunk = (dataArray: MappedDataObj[]) => {
        dispatch({ type: "chartData", payload: dataArray });
    };

    const getData = useCallback(async (event): Promise<void> => {
        event.preventDefault();
        const infoUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.symbol}&apikey=${apiKey}`
        try {
            const infoResponse = await axios.get(infoUrl);
            // console.log(infoResponse);
            if (infoResponse.data.Note) {
                return dispatch({ type: "errorMessage", payload: "Server error. Please try again later." })
            }
            if (!infoResponse.data.Symbol) {
                return dispatch({ type: "errorMessage", payload: `We could not find any data for "${state.symbol}". Please check your input and try again.` })
            }
            dispatch({ type: "companyInfo", payload: infoResponse.data });

            handleRequest(state.dataChunk);

            dispatch({ type: "symbol", payload: "" });

        } catch (error) {
            console.log(error);
        }
    }, [state.symbol, state.dataChunk]);

    const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        return dispatch({ type: "symbol", payload: event.target.value });
    };

    const clearErrorMessage = () => {
        dispatch({ type: "errorMessage", payload: "" })
    }

    const handleRequest = async (chunk: string) => {
        const todayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${state.symbol}&interval=15min&apikey=${apiKey}`;
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${state.symbol}&apikey=${apiKey}`
        let response;
        try {
            switch (state.dataChunk) {
                case "lastDay": {

                    response = await axios.get(todayUrl);


                    if (!response.data["Time Series (15min)"]) {
                        dispatch({ type: "errorMessage", payload: "Data could not be retrieved. Please try again later" });
                    }

                    let dataToMap = [];
                    const dates: number[] = [];
                    for (let key in response.data["Time Series (15min)"]) {
                        dates.push(new Date(key).getTime());
                        dataToMap
                            .push({ date: new Date(key), value: +response.data["Time Series (15min)"][key]["4. close"] });
                    }
                    // get the last day (previous day) from the response and filter array
                    const maxDate = new Date(Math.max(...dates));
                    dataToMap = dataToMap.filter(entry => entry.date.getDate() === maxDate.getDate());

                    // add the last price from previous day to state.companyInfo
                    const prevClose = dataToMap.find(el => el.date.toString() === maxDate.toString());
                    if (prevClose) dispatch({ type: "companyInfo", payload: { prevClose: prevClose.value.toFixed(2) } })

                    mapDataChunk(dataToMap);
                    break;
                }
                default:
                    return;
            }
        } catch (e) {
            if (e) dispatch({ type: "errorMessage", payload: "We could not retrieve any data. Please try again later." })
        }
    }

    console.log(state.companyInfo)
    return (<main>
        <Backdrop show={!!state.errorMessage} onClick={clearErrorMessage} />
        <Modal show={!!state.errorMessage} ><p>{state.errorMessage}</p>
            <button
                className={styles.searchBtn}
                onClick={clearErrorMessage}
            >Close</button>
        </Modal>
        <form className={styles.searchForm} onSubmit={e => getData(e)}>
            <input
                required
                maxLength={20}
                type="text"
                value={state.symbol}
                onChange={e => handleSymbolChange(e)} placeholder="Company symbol..."
            />
            <button className={styles.searchBtn}>Search</button>
        </form>
        <section className={styles.chartContainer}>
            {state.companyInfo.Symbol && state.companyInfo.prevClose &&
                <React.Fragment>
                    <CompanyInfo
                        info={state.companyInfo}
                    />
                    <ChartNav handleRequest={handleRequest} dataChunk={state.dataChunk} />
                </React.Fragment>}

            <Chart data={state.chartData} />
        </section>
    </main >)
}

export default Display;