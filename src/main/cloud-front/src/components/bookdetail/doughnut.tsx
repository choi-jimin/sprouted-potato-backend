import React from 'react';
import {styled} from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Doughnut} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Main = styled.div`
  width: 50%;
`

interface resultAIStatsType {
  resultAI: number;
}

export const Options = {};

export default function AssetDoughnutChart(props:resultAIStatsType) {
  const chartId = 'myUniqueDoughnutChartId';

  const Data = {
    labels: ["긍정", "중립", "부정"],
    datasets: [
      {
        data: props.resultAI,
        backgroundColor: ["#FDF6C2", "#CFF6FF", "#DAF5D3"],
        borderColor: ["#FDF6C2", "#CFF6FF", "#DAF5D3"],
      },
    ],
  };

  return (
    <Main>
        <Doughnut id={chartId} data={Data} options={Options}></Doughnut>
    </Main>
  );
}