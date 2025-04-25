import {
    Box,
    VStack,
    Button,
    useColorModeValue,
    Text,
    IconButton
  } from '@chakra-ui/react';
  import { FiSettings, FiCalendar, FiHome } from 'react-icons/fi';
  
  const Sidebar = () => {
    const bg = useColorModeValue('gray.100', 'gray.800');
    const color = useColorModeValue('gray.700', 'white');
  
    return (
      <Box
        w="250px"
        bg={bg}
        color={color}
        p={4}
        minH="100vh"
        boxShadow="md"
        position="sticky"
        top={0}
      >
        <Text fontSize="xl" mb={4} fontWeight="bold">控制面板</Text>
        <VStack spacing={4} align="stretch">
          <Button leftIcon={<FiHome />} variant="ghost">主页</Button>
          <Button leftIcon={<FiCalendar />} variant="ghost">日程表</Button>
          <Button leftIcon={<FiSettings />} variant="ghost">设置</Button>
        </VStack>
      </Box>
    );
  };
  
  export default Sidebar;
  