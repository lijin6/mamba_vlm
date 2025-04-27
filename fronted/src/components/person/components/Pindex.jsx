import { Box, Flex } from '@chakra-ui/react';
import UserProfile from './UserProfile';
import PieChart from './PieChart'
import AnnouncementList from './AnnouncementList';

export default function Pindex() {
  return (
    <Box p={6}>
      <Flex w={"100%"} ml={10} >
        <Box w={"40%"} p={4}>
          <UserProfile />
          <AnnouncementList />
        </Box>
        <Box w={"50%"} p={4}>
          <PieChart />
        </Box>
      </Flex>
    </Box>
  )
}