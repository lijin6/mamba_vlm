import { useState } from "react";
import {
  Button,
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";

// 初始化 DeepSeek API 实例
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-3eeb7df80233438597b6f2c018265611", // ⚠️ 建议从环境变量注入
  dangerouslyAllowBrowser: true,
});

const AIAdviceCard = () => {
  const [aiAdvice, setAiAdvice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchAdvice = async () => {
    setIsGenerating(true);
    try {
      const res = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
              你是一位资深医学专家，请根据前列腺MRI影像学检查结果生成一份详细的诊断报告。
              你需要包括以下内容：
              1. **影像分析**：分析前列腺的大小、形态、质地等，描述是否有异常（如增大、肿块等）。
              2. **可能的诊断**：根据影像分析提供可能的疾病或病症。
              3. **进一步建议**：推荐是否需要进一步的检查或治疗，如影像学进一步检查、实验室检查、治疗方案等。
              4. **语气要求**：报告应简洁、清晰、专业，避免使用复杂术语，适合患者理解。 以第一人称口吻生成 不要有 如 可能等
              直接把你自己当作医师，。
            `,
          },
          {
            role: "user",
            content: "影像初步检查发现异常，请生成详细的前列腺MRI诊断建议。",
          },
        ],
      });
      const content = res.choices[0].message.content;
      setAiAdvice(content);
      onOpen();
    } catch (err) {
      toast({
        title: "AI分析失败",
        description: err.message || "DeepSeek请求出错",
        status: "error",
        isClosable: true,
        duration: 4000,
        position: "top",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={fetchAdvice} isLoading={isGenerating}>
        获取AI分析建议
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="scale">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontWeight="bold" fontSize="lg">
            MAMBA AI分析建议
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody whiteSpace="pre-wrap" pb={6} px={4}>
            <VStack spacing={4} align="stretch">
              <Box
                bg={useColorModeValue("blue.50", "blue.900")}
                p={4}
                borderRadius="md"
                boxShadow="lg"
                maxHeight="300px"
                overflowY="auto"
                fontSize="sm"
                color={useColorModeValue("gray.700", "gray.200")}
              >
                {/* 使用 ReactMarkdown 渲染 Markdown 格式的 AI 输出 */}
                <ReactMarkdown>
                  {aiAdvice || "正在生成前列腺分析建议..."}
                </ReactMarkdown>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AIAdviceCard;
