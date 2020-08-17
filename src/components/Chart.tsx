import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

import styles from "./Chart.module.scss";

interface ChartProps {
    xValues: string[];
    yValues: number[];
}

const Chart = ({ xValues, yValues }: ChartProps) => {
    const svgRef = useRef(null);
    const pathRef = useRef(null);
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);

    const width = 800;
    const height = 450;
    const margin = {
        top: 30,
        right: 30,
        bottom: 40,
        left: 40
    }

    const draw = useCallback(() => {
        const dataset = { xValues, yValues };

    }, [xValues, yValues])

    useEffect(() => { if (xValues) draw() }, [xValues, draw]);

    return <svg
        className={styles.chart}
        ref={svgRef}
        preserveAspectRatio="xMinYMid"
        viewBox={`0 0 ${width} ${height}`}
    >
        <path ref={pathRef}></path>
        <g ref={yAxisRef}></g>
        <g ref={xAxisRef}></g>
    </svg>
}

export default Chart;