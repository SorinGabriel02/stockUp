import React, { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

import styles from "./Chart.module.scss";
import { MappedDataObj } from "../interfaces/MappedDataObj";

interface ChartProps {
    data: MappedDataObj[];
}

const Chart = ({ data }: ChartProps) => {
    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);
    const tooltipRef = useRef(null);

    const margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 50
    }
    const width = 800;
    const height = 350;

    const draw = useCallback((data) => {
        console.log(data);
        // X-Axis
        const xMinMax: any = d3.extent(data.map((d: { date: Date; }) => d.date));

        let x = d3
            .scaleTime()
            .domain(xMinMax)
            .range([0 + margin.left, width - margin.right])
            .nice();

        const axisBottom: any = d3.axisBottom(x)

        d3.select(xAxisRef.current)
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(axisBottom);

        // Y-Axis
        //const yMax: any = d3.max(data, (d: { value: number; }) => d.value);
        const yMinMax: any = d3.extent(data.map((d: { value: number; }) => d.value));

        let y = d3
            .scaleLinear()
            .domain(yMinMax)
            .range([height - margin.bottom, 0 + margin.top]).nice();

        const axisLeft: any = d3.axisLeft(y);

        d3.select(yAxisRef.current).attr("transform", `translate(${margin.left})`).call(axisLeft);

        // add line --> path
        const line = d3.line<any>().x(d => x(d.date)).y(d => y(d.value))

        d3.select(pathRef.current)
            .datum(data)
            .attr("fill", "none")
            .attr("class", "path")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 0)
            .attr("d", line)
            .transition()
            .duration(300)
            .attr("stroke-width", 2);

    }, [height, width, margin])

    useEffect(() => { if (data) draw(data) }, [data, draw]);

    console.log(data);

    return <svg
        className={styles.chart}
        ref={svgRef}
        preserveAspectRatio="xMinYMid"
        viewBox={`0 0 ${width} ${height}`}
    >
        <path ref={pathRef}></path>
        <g className={styles.group} ref={xAxisRef}></g>
        <g className={styles.group} ref={yAxisRef}></g>
        <div ref={tooltipRef} ></div>
    </svg>
}

export default React.memo(Chart);