import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue, Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Flex, IconButton } from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const ReportList = () => {
  
  // const reports = [
  //     { id: 1, time: '2025-4-25 10:30' },
  //     { id: 2, time: '2025-4-25 14:45' },
  //     { id: 3, time: '2025-4-23 09:15' },
  //     { id: 4, time: '2025-4-22 16:20' },
  //   ];
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // 模拟从 API 获取数据
    axios.get('http://127.0.0.1:5000/api/reports')
      .then((response) => {
        setReports(response.data)
        console.log(response.data)
      })
      .catch((error) => console.error('Failed to fetch reports:', error));
  }, []);


  return (
    <Box bg={useColorModeValue('white', 'gray.900')} borderRadius="lg" boxShadow="md" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        检查报告列表
      </Text>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>报告 ID</Th>
              <Th>时间</Th>
              <Th>操作</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.map((report) => (
              <Tr key={report.id}>
                <Td>{report.id}</Td>
                <Td>{report.time}</Td>
                <Td>
                  <Flex gap={2}>
                    <IconButton
                      aria-label="View report"
                      icon={<ViewIcon />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => alert(`查看报告 ID: ${report.id}`)}
                    />
                    <IconButton
                      aria-label="Edit report"
                      icon={<EditIcon />}
                      colorScheme="green"
                      size="sm"
                      onClick={() => alert(`编辑报告 ID: ${report.id}`)}
                    />
                    <IconButton
                      aria-label="Delete report"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => alert(`删除报告 ID: ${report.id}`)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportList;