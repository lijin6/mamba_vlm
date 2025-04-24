import { 
    Container, Box, Button, Collapse, useDisclosure,
    SimpleGrid, ScaleFade, Flex, Center, useToast,
    Text, Image
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { FiUpload, FiDownload, FiArrowLeft, FiSend } from 'react-icons/fi';
  
  const Identify = () => {
    const [reporturl, setReporturl] = useState();
    const navigate = useNavigate();
    const [box1, setBox1] = useState({ imageSrc: null, imageFile: null });
    const [box2, setBox2] = useState({ imageSrc: null, imageFile: null });
    const [box3, setBox3] = useState({ imageSrc: null, imageFile: null });
    const [images, setImages] = useState([]);
    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
    const toast = useToast();
  
    const handleFileSelect = (setState) => (event) => {
      const file = event.target.files[0];
      if (file) {
        setState({
          imageFile: file,
          imageSrc: URL.createObjectURL(file),
        });
      }
    };
  
    const triggerFileInput = (setState) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = handleFileSelect(setState);
      input.click();
    };
  
    const handleSubmit = async () => {
      setIsLoading(true);
      const files = [box1.imageFile, box2.imageFile, box3.imageFile].filter(Boolean);
      
      if (files.length === 0) {
        toast({
          title: "请上传图片",
          description: "请至少上传一张图片",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }
  
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
  
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) throw new Error("上传失败");
  
        const data = await response.json();
        setReporturl(data.report_url);
        setImages(data.processed_files);
        setResult("识别完成！");
        
        toast({
          title: "成功",
          description: "图片处理成功",
          status: "success",
          duration: 2000,
        });
        
        setTimeout(() => {
          onPreviewOpen();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("上传出错：", error);
        toast({
          title: "错误",
          description: "上传失败，请重试！",
          status: "error",
          duration: 3000,
        });
        setIsLoading(false);
      }
    };
  
    const handleDownload = () => {
      if (!reporturl) return;
      
      const link = document.createElement('a');
      link.href = reporturl;
      link.download = 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "下载开始",
        description: "报告正在下载",
        status: "info",
        duration: 2000,
      });
    };
  
    const UploadBox = ({ state, setState }) => (
      <Center
        w="22vw"
        h="300px"
        minW="200px"
        onClick={() => triggerFileInput(setState)}
        cursor="pointer"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="gray.200"
        borderRadius="md"
        _hover={{ borderColor: "teal.300" }}
      >
        {state.imageSrc ? (
          <ScaleFade initialScale={0.9} in={true}>
            <Image
              src={state.imageSrc}
              alt="Uploaded preview"
              maxW="100%"
              maxH="100%"
              objectFit="contain"
            />
          </ScaleFade>
        ) : (
          <Flex direction="column" align="center">
            <Box fontSize="3xl" mb={2}>
              <FiUpload />
            </Box>
            <Text fontWeight="medium">点击上传图片</Text>
            <Text fontSize="sm" color="gray.500">支持 JPG, PNG, GIF 格式</Text>
          </Flex>
        )}
      </Center>
    );
  
    return (
      <Box minH="100vh" bg="gray.50" p={4}>
        {/* Header */}
        <Flex justify="space-between" mb={8}>
          <Button 
            leftIcon={<FiArrowLeft />} 
            colorScheme="teal"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
          <Text fontSize="xl" fontWeight="bold">图片识别系统</Text>
          <Box w="40px" /> {/* Spacer for alignment */}
        </Flex>
  
        {/* Main Content */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Upload Section */}
          <Box flex={1}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={6}>
              <UploadBox state={box1} setState={setBox1} />
              <UploadBox state={box2} setState={setBox2} />
              <UploadBox state={box3} setState={setBox3} />
            </SimpleGrid>
            
            <Center>
              <Button 
                colorScheme="teal" 
                size="lg" 
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="处理中..."
                leftIcon={<FiSend />}
              >
                提交所有照片
              </Button>
            </Center>
          </Box>
  
          {/* Results Section */}
          <Box flex={1}>
            <Collapse in={isPreviewOpen} animateOpacity>
              <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" mb={4}>处理结果</Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={6}>
                  {images.map((image, index) => (
                    <Box key={index} borderWidth="1px" borderRadius="md" p={2}>
                      <Image
                        src={image.url}
                        alt={image.filename}
                        w="100%"
                        h="180px"
                        objectFit="contain"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
                
                <Text mb={4} fontWeight="medium">处理结果：{result}</Text>
                
                <Button 
                  colorScheme="teal" 
                  variant="outline"
                  onClick={handleDownload}
                  leftIcon={<FiDownload />}
                  w="100%"
                >
                  下载报告
                </Button>
              </Box>
            </Collapse>
          </Box>
        </Flex>
      </Box>
    );
  };
  
  export default Identify;