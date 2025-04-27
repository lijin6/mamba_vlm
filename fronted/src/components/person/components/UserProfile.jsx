import { Box, Flex, Avatar, Text, Stack, useColorModeValue } from '@chakra-ui/react';

const UserProfile = () => {
  return (
    <Box bg={useColorModeValue('white', 'gray.900')} borderRadius="lg" boxShadow="md" p={4}>
      <Flex align="center" mb={4}>
        <Box
          position="relative"
          width="100%"
          height="200px"
          bgImage="url('/static/images/header1.png')"
          bgSize="cover"
          bgPosition="center"
          borderRadius="lg"
        >
          <Avatar
            size="xl"
            // src="static/images/header1.png"
            position="absolute"
            bottom="-20px"
            left="50%"
            transform="translateX(-50%)"
          />
        </Box>
      </Flex>

      {/* User details */}
      <Stack spacing={2} align="center">
        <Text fontSize="2xl" fontWeight="bold">
          医师
        </Text>
        <Text color="gray.500">
          张三 | 30岁 | 男
        </Text>
      </Stack>

      {/* Stats */}
      <Flex justify="center" mt={4}>
        <Box mx={4}>
          <Text fontSize="2xl" fontWeight="bold">
            17
          </Text>
          <Text color="gray.500">检查数量</Text>
        </Box>
        <Box mx={4}>
          <Text fontSize="2xl" fontWeight="bold">
            13
          </Text>
          <Text color="gray.500">待检查</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserProfile;