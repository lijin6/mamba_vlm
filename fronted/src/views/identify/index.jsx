import { Container, Box, Button, Collapse, useDisclosure, SimpleGrid, ScaleFade } from '@chakra-ui/react';
import { Wrap, WrapItem, Center } from '@chakra-ui/react'
import { useState } from 'react';
import styles from '../../css/identify.module.css';
import { useNavigate } from 'react-router-dom';

// import { Fade, ScaleFade, Slide, SlideFade, Collapse } from '@chakra-ui/react'

const Identify = () => {

    const { isOpen, onToggle } = useDisclosure()
    const [ reporturl, setReporturl ] = useState();
    const navigate = useNavigate();
    // const onToggle = () => setIsOpen(!isOpen)
    const [box1, setBox1] = useState({ imageSrc: null, imageFile: null });
    const [box2, setBox2] = useState({ imageSrc: null, imageFile: null });
    const [box3, setBox3] = useState({ imageSrc: null, imageFile: null });
    const [images, setImages] = useState([]); // 存储图片数据
    const [result, setResult] = useState(); // 存储识别结果
    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
    const onTogglePrivew = () => (isPreviewOpen ? onPreviewClose() : onPreviewOpen());

    // Handle file selection for each box
    const handleFileSelect = (setState) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setState({
                imageFile: file,
                imageSrc: URL.createObjectURL(file),
            });
        }
    };

    // Trigger file input for a specific box
    const triggerFileInput = (setState) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = handleFileSelect(setState);
        input.click();
    };

    // Submit all images
    const handleSubmit = async () => {
        if (isPreviewOpen) {
            onPreviewClose();
        }
        const files = [box1.imageFile, box2.imageFile, box3.imageFile].filter(Boolean); // Filter out null values
        if (files.length === 0) {
            alert("请至少上传一张图片！");
            return;
        }

        // 创建 FormData 对象
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file); // 添加所有文件到 FormData
        });

        try {
            // 发送 POST 请求到 Flask 后端
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            console.log(response);
            console.log(response.ok);
            console.log(response.data);
            if (!response.ok) {
                throw new Error("上传失败");
            }

            // 解析响应数据
            const data = await response.json();
            console.log("处理后的图片：", data.report_url);
            setReporturl(data.report_url);
            setImages(data.processed_files);
            setResult("识别完成！")
            // 显示处理后的图片 URL
            // alert(`处理完成！图片 URL: ${data.processed_files.map(f => f.url).join(", ")}`);
            setTimeout(() => {
                onPreviewOpen();
            }, 2000);
        } catch (error) {
            console.error("上传出错：", error);
            alert("上传失败，请重试！");
        }
    };

    const handleDownload = () => {
        // 定义文件的 URL
    
        // 创建一个隐藏的 <a> 标签
        const link = document.createElement('a');
        link.href = reporturl;
        link.download = 'report.pdf'; // 设置下载后的文件名
        document.body.appendChild(link);
        link.click(); // 触发点击事件
        document.body.removeChild(link); // 清理 DOM
      };
    


    return (
        <div>
            <Container maxW='100vw' centerContent display={'flex'} flexDirection={'row'} alignItems={'center'} style={{
                background: 'linear-gradient(to bottom, #0A3D62, #F5F5F5)',
                height: '100vh'
            }}>
                <Container maxW='50%' centerContent>
                    <Wrap spacing="20px">
                        {/* Box 1 */}
                        <WrapItem>
                            <Center
                                w="20vw"
                                h="400px"
                                minW="150px"
                                onClick={() => triggerFileInput(setBox1)}
                                cursor="pointer"
                                className={styles.preview_box}
                            >
                                {box1.imageSrc ? (
                                    <ScaleFade initialScale={0.9} in={true}>
                                        <Box
                                            as="img"
                                            src={box1.imageSrc}
                                            alt="Uploaded preview"
                                            maxW="100%"
                                            maxH="100%"
                                            objectFit="contain"
                                        />
                                    </ScaleFade>
                                ) : (
                                    <Box >
                                        <div className={styles.upload_content}>
                                            <div className={styles.upload_icon}>📤</div>
                                            <div className={styles.upload_text}>点击上传图片</div>
                                            <div className={styles.upload_subtext}>支持 JPG, PNG, GIF 格式</div>
                                        </div>
                                    </Box>
                                )}
                            </Center>
                        </WrapItem>

                        {/* Box 2 */}
                        <WrapItem>
                            <Center
                                w="20vw"
                                h="400px"
                                minW="150px"
                                onClick={() => triggerFileInput(setBox2)}
                                cursor="pointer"
                                className={styles.preview_box}
                            >
                                {box2.imageSrc ? (
                                    <ScaleFade initialScale={0.9} in={true}>
                                        <Box
                                            as="img"
                                            src={box2.imageSrc}
                                            alt="Uploaded preview"
                                            maxW="100%"
                                            maxH="100%"
                                            objectFit="contain"
                                        />
                                    </ScaleFade>
                                ) : (
                                    <Box >
                                        <div className={styles.upload_content}>
                                            <div className={styles.upload_icon}>📤</div>
                                            <div className={styles.upload_text}>点击上传图片</div>
                                            <div className={styles.upload_subtext}>支持 JPG, PNG, GIF 格式</div>
                                        </div>
                                    </Box>
                                )}
                            </Center>
                        </WrapItem>

                        {/* Box 3 */}
                        <WrapItem>
                            <Center
                                w="20vw"
                                h="400px"
                                minW="150px"
                                onClick={() => triggerFileInput(setBox3)}
                                cursor="pointer"
                                className={styles.preview_box}
                            >
                                {box3.imageSrc ? (
                                    <ScaleFade initialScale={0.9} in={true}>
                                        <Box
                                            as="img"
                                            src={box3.imageSrc}
                                            alt="Uploaded preview"
                                            maxW="100%"
                                            maxH="100%"
                                            objectFit="contain"
                                        />
                                    </ScaleFade>
                                ) : (
                                    <Box >
                                        <div className={styles.upload_content}>
                                            <div className={styles.upload_icon}>📤</div>
                                            <div className={styles.upload_text}>点击上传图片</div>
                                            <div className={styles.upload_subtext}>支持 JPG, PNG, GIF 格式</div>
                                        </div>
                                    </Box>
                                )}
                            </Center>
                        </WrapItem>

                        {/* Box 4 (Submit Button) */}
                        <WrapItem>
                            <Box w="20vw" h="400px" minW="150px" display={"flex"} justifyContent={"center"}>
                                <Button colorScheme="teal" size="lg" onClick={handleSubmit}>
                                    提交所有照片
                                </Button>
                            </Box>
                        </WrapItem>
                    </Wrap>
                </Container>
                <Container maxW='48%'>
                    <Collapse in={isPreviewOpen} animateOpacity>
                        <Container maxW='100%' centerContent>
                            <Wrap>
                                {images.map((image, index) => (
                                    <WrapItem key={index} className={styles.show_preview_box}>
                                        <Center w="19vw" h="350px" minW="150px">
                                            {/* 渲染图片 */}
                                            <img
                                                src={image.url} // 图片 URL
                                                alt={image.filename} // 图片描述
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />
                                        </Center>
                                    </WrapItem>
                                ))}
                                <WrapItem className={styles.show_preview_box}>
                                    <Center w='19vw' h='350px' minW={"150px"}>
                                        处理结果：{result}
                                    </Center>
                                </WrapItem>
                            </Wrap>
                        </Container>
                        <Container maxW='100%' centerContent marginTop={'20px'}>
                            <Button colorScheme='teal' variant='outline' onClick={handleDownload}>
                                下载报告
                            </Button>

                        </Container>
                    </Collapse>
                </Container>

            </Container>
            <div className={styles.footer}>
                <Button colorScheme='teal' onClick={() => navigate(-1)}>
                    返回
                </Button>
            </div>
        </div>
    )
};

export default Identify;