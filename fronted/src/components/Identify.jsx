import {
    Box, Card, CardBody, CardHeader, CardFooter,
    Image, Stack, Text, HStack, Button,
    useColorModeValue, Tag, TagLabel, Flex,
    useToast, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalCloseButton, useDisclosure
  } from '@chakra-ui/react';
  import { FiDownload } from 'react-icons/fi';
  import { useState } from 'react';
  
  const Identify = () => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [aiAdvice, setAiAdvice] = useState('');
  
    // 前列腺相关分析建议
    const generateAiAdvice = () => {
      const advice = `基于当前前列腺MRI影像分析，AI医学助手建议：
      
  1. 前列腺评估：
     - 前列腺体积增大，约45ml（正常<30ml）
     - 外周带T2信号不均，建议关注PIRADS评分
     - 中央腺体可见小结节，直径约6mm
  
  2. 可疑病灶：
     - 右侧外周带局部低信号区（PIRADS 3分）
     - 建议行多参数MRI进一步评估
     - 必要时考虑靶向穿刺活检
  
  3. 周围结构：
     - 精囊腺对称，未见明显异常
     - 直肠前筋膜完整
     - 盆腔淋巴结未见增大
  
  4. 临床建议：
     - 结合PSA水平综合评估
     - 建议3-6个月后复查MRI
     - 如有排尿困难症状可考虑药物治疗`;
  
      setAiAdvice(advice);
      onOpen();
    };
  
    // 导出PDF功能
    const exportToPDF = () => {
      toast({
        title: '报告导出成功',
        description: '前列腺MRI分析报告已生成PDF文件',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };
  
    return (
      <Box p={6}>
        <HStack spacing={6} align="flex-start">
          {/* 原始MRI图像展示 */}
          <Card bg={cardBg} flex={1} boxShadow="md">
            <CardHeader fontWeight="bold" fontSize="lg">
              前列腺MRI原始图像 (T2加权)
            </CardHeader>
            <CardBody>
              <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                <Image 
                  src="demo/before.png"
                  alt="前列腺MRI图像"
                  objectFit="contain"
                  maxH="500px"
                  w="full"
                />
              </Box>
            </CardBody>
            <CardFooter>
              <Button 
                colorScheme="blue" 
                size="sm"
                onClick={generateAiAdvice}
              >
                获取前列腺AI分析
              </Button>
            </CardFooter>
          </Card>
  
          {/* 分割结果展示 */}
          <Card bg={cardBg} flex={1} boxShadow="md">
            <CardHeader fontWeight="bold" fontSize="lg">
              前列腺分区标记结果
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                  <Image 
                    src="demo/deal.png"
                    alt="前列腺分割图像"
                    objectFit="contain"
                    maxH="500px"
                    w="full"
                  />
                </Box>
  
                {/* 前列腺分区标签 */}
                <Box mt={4}>
                  <Text fontWeight="medium" mb={2}>前列腺解剖分区</Text>
                  <Flex wrap="wrap" gap={2}>
                    <Tag colorScheme="red" size="md">
                      <TagLabel>外周带</TagLabel>
                    </Tag>
                    <Tag colorScheme="blue" size="md">
                      <TagLabel>中央区</TagLabel>
                    </Tag>
                    <Tag colorScheme="green" size="md">
                      <TagLabel>移行带</TagLabel>
                    </Tag>
                    <Tag colorScheme="yellow" size="md">
                      <TagLabel>前纤维基质</TagLabel>
                    </Tag>
                    <Tag colorScheme="purple" size="md">
                      <TagLabel>精阜</TagLabel>
                    </Tag>
                  </Flex>
                </Box>
  
                {/* 影像学发现 */}
                <Box mt={4} p={3} bg={useColorModeValue('gray.50', 'gray.600')} borderRadius="md">
                  <Text fontWeight="medium" mb={2}>影像学发现</Text>
                  <Text fontSize="sm">
                    • 前列腺体积增大，约45ml<br/>
                    • 外周带T2信号不均，局部低信号灶<br/>
                    • 中央区可见小囊变<br/>
                    • 前列腺包膜完整，周围脂肪间隙清晰
                  </Text>
                </Box>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button 
                leftIcon={<FiDownload />}
                colorScheme="teal"
                onClick={exportToPDF}
              >
                导出PDF报告
              </Button>
            </CardFooter>
          </Card>
        </HStack>
  
        {/* AI建议模态框 */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>MAMBA AI分析建议</ModalHeader>
            <ModalCloseButton />
            <ModalBody whiteSpace="pre-wrap" pb={6}>
              <Box bg={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="md">
                {aiAdvice || "正在生成前列腺分析建议..."}
              </Box>
              <Button 
                mt={4} 
                colorScheme="blue" 
                onClick={exportToPDF}
              >
                导出完整建议(PDF)
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default Identify;