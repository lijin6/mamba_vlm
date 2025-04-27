import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const AnnouncementList = () => {
  // 模拟公告数据
  const announcements = [
    { id: 1, title: '系统升级通知', date: '2025-4-25', status: 'Active' },
    { id: 2, title: '新功能上线', date: '2025-4-25', status: 'Inactive' },
    { id: 3, title: '维护通知', date: '2025-4-25', status: 'Active' },
    { id: 4, title: '安全更新提醒', date: '2025-4-25', status: 'Inactive' },
  ];

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} borderRadius="lg" boxShadow="md" p={6} marginTop={'10px'}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        公告管理
      </Text>

      {/* 表格 */}
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>标题</Th>
              <Th>发布日期</Th>
              {/* <Th>操作</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {announcements.map((announcement) => (
              <Tr key={announcement.id}>
                <Td>{announcement.title}</Td>
                <Td>{announcement.date}</Td>
                {/* <Td>
                  <Button size="sm" colorScheme="blue" mr={2}>
                    编辑
                  </Button>
                  <Button size="sm" colorScheme="red">
                    删除
                  </Button>
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AnnouncementList;