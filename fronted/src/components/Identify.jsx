import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Stack,
  Text,
  VStack,
  Button,
  useColorModeValue,
  useToast,
  useDisclosure,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import AIAdviceModal from "./AIAdviceModal";
import OrganLegend from "./OrganLegend";

const Identify = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [aiAdvice, setAiAdvice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const generateAiAdvice = () => {
    const advice = `基于当前前列腺MRI影像分析，AI医学助手建议：\n1. 推荐进行PSA水平监测；\n2. 建议根据临床症状评估是否行穿刺活检；\n3. T2低信号灶可提示肿瘤可能性，建议多模态评估（如DWI、DCE）；`;
    setAiAdvice(advice);
    onOpen(); // 打开模态框
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast({
        title: "无文件上传",
        description: "请上传有效的前列腺MRI影像文件。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // 读取Base64数据并设置图片预览
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      toast({
        title: "文件上传失败",
        description: "请检查文件格式或网络连接。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const data = await response.json();
    const { original_image, overlay_image } = data;

    // 拼接正确的图像路径
    setOriginalImage(`http://localhost:5000${original_image}`);
    setProcessedImage(`http://localhost:5000${overlay_image}`);

    toast({
      title: "文件上传成功",
      description: "前列腺影像已处理完成。",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // generateAiAdvice(); // 生成AI建议
  };

  const exportToPDF = () => {
    toast({
      title: "报告导出成功",
      description: "前列腺MRI分析报告已生成PDF文件",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFileReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setAiAdvice("");
    setImagePreview(null);
    toast({
      title: "文件已重置",
      description: "请重新上传前列腺MRI影像文件。",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={8}>
      <SimpleGrid columns={[1, null, 2]} spacing={6} justifyItems="center">
        {/* 上传卡片 */}
        <Card
          bg={cardBg}
          w="100%"
          maxW="480px"
          aspectRatio={1}
          boxShadow="lg"
          display="flex"
          flexDir="column"
          justifyContent="space-between"
        >
          <CardHeader fontWeight="bold" fontSize="lg" textAlign="center">
            上传前列腺MRI图像 (T2加权)
          </CardHeader>

          <CardBody>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                请上传T2加权前列腺MRI影像文件 (支持 .nii.gz 格式)
              </Text>
              <Input
                type="file"
                accept=".nii.gz"
                onChange={handleFileUpload}
                display="none"
                id="file-upload"
              />
              {originalImage && (
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  w="full"
                >
                  <Image
                    src={originalImage}
                    alt="前列腺原始图像"
                    objectFit="contain"
                    maxH="360px"
                    w="full"
                  />
                </Box>
              )}
            </VStack>
          </CardBody>

          <CardFooter>
            <Box w="full" textAlign="center">
              <label htmlFor="file-upload" style={{ width: "60%" }}>
                <Button
                  leftIcon={<FaFileUpload size="20px" />}
                  as="span"
                  colorScheme="blue"
                  isFullWidth
                  height="48px"
                  fontSize="md"
                  py={6}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  iconSpacing={4}
                >
                  选择文件
                </Button>
              </label>
              {originalImage && (
                <Button
                  mt={4}
                  colorScheme="red"
                  onClick={handleFileReset}
                  isFullWidth
                  height="48px"
                  fontSize="md"
                >
                  重置文件
                </Button>
              )}
            </Box>
          </CardFooter>
        </Card>

        {/* 结果展示卡片 */}
        <Card
          bg={cardBg}
          w="100%"
          maxW="480px"
          aspectRatio={1}
          boxShadow="lg"
          display="flex"
          flexDir="column"
          justifyContent="space-between"
        >
          <CardHeader fontWeight="bold" fontSize="lg" textAlign="center">
            前列腺分区标记结果
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {processedImage && (
                <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                  <Image
                    src={processedImage}
                    alt="前列腺分割图像"
                    objectFit="contain"
                    maxH="360px"
                    w="full"
                  />
                </Box>
              )}
            </Stack>
          </CardBody>
          <CardFooter>
            <Box w="full" textAlign="center">
              <Button
                leftIcon={<FiDownload size="20px" />}
                colorScheme="teal"
                onClick={exportToPDF}
                isFullWidth
                height="48px"
                fontSize="md"
                py={6}
              >
                导出PDF报告
              </Button>
            </Box>
          </CardFooter>
        </Card>
      </SimpleGrid>
      <Box display="flex" justifyContent="center" >
      <AIAdviceModal
        isOpen={isOpen}
        onClose={onClose}
        aiAdvice={aiAdvice}
        exportToPDF={exportToPDF}
      />
      </Box>

    
      <OrganLegend />
    </Box>
  );
};

export default Identify;
