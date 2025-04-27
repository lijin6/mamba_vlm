import { Box, useColorModeValue, Text } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';

export default function PieChart() {


  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            value: 17,
            name: '检查数量'
          },
          {
            value: 13,
            name: '待检查'
          },
        ],

      }
    ]
  }

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} borderRadius="lg" boxShadow="md" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        数据饼图
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
}