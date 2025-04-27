import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, useColorModeValue, Text } from '@chakra-ui/react';

const LineChart = () => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const getRecentThreeDays = () => {
      const today = new Date();
      const recentDates = [];

      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        recentDates.push(date.toISOString().split('T')[0]);
      }

      setDates(recentDates.reverse());
    };

    getRecentThreeDays(); 
  }, []);

  const counts = [25, 20, 30];

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: counts,
        type: 'line',
        // smooth: true, // 平滑曲线
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true,
    },
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} borderRadius="lg" boxShadow="md" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
      近 3 天检查数量
      </Text>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '400px' }}
        notMerge={true}
        lazyUpdate={true}
        theme={"light"}
      />
    </Box>
  );
};

export default LineChart;