import { Box, Flex } from '@chakra-ui/react';
import PieChart from './PieChart';
import LineChart from './LineChart';

export default function Echart(){
  return (
    <Box p={6}>
    <Flex w={"100%"} ml={10} >
      <Box w={"40%"} p={4}>
        <LineChart />
      </Box>
      <Box w={"50%"} p={4}>
        <PieChart />
      </Box>
    </Flex>
  </Box>
  );
}