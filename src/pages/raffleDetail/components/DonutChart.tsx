import React from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  participant: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ participant }) => {
  const winningProbability = (1 / participant) * 100;

  const data: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [winningProbability, 100 - winningProbability], // 퍼센트 값
        backgroundColor: ['#C908FF', '#E4E4E4'], // 보라색 & 회색
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // 안쪽 원 크기 조절
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number;
            return `${tooltipItem.label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <Wrapper>
      <Doughnut data={data} options={options} />
      <PercentageBox> {winningProbability.toFixed(0)}%</PercentageBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 167px;
  height: 167px;
  position: relative;
`;

const PercentageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 122px;
  height: 65px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 54px */
`;

export default DonutChart;
