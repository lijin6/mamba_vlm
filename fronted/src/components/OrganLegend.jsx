import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";

const organLabels = {
    1: "肝脏",
    2: "右肾",
    3: "脾脏",
    4: "胰腺",
    5: "主动脉",
    6: "下腔静脉",
    7: "右肾上腺",
    8: "左肾上腺",
    9: "胆囊",
    10: "食管",
    11: "胃",
    12: "十二指肠",
    13: "左肾"
  };
  
  const organColors = {
    1: [0, 1, 0, 0.6],
    2: [1, 0, 0, 0.6],
    3: [1, 1, 0, 0.6],
    4: [0, 0, 1, 0.6],
    5: [1, 0, 1, 0.8],
    6: [0, 1, 1, 0.6],
    7: [1, 0.5, 0, 0.6],
    8: [0.5, 0, 0.5, 0.6],
    9: [1, 0.75, 0.8, 0.6],
    10: [0.5, 0.5, 0.5, 0.6],
    11: [0, 0.5, 0, 0.6],
    12: [0.5, 0, 0, 0.6],
    13: [0, 0, 0.5, 0.6]
  };

const OrganLegend = () => {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      position="fixed"
      right="20px"
      bottom="20px"
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="lg"
      maxH="70vh"
      overflowY="auto"
      zIndex={1000}
    >
      <Text fontWeight="bold" mb={2}>
        器官颜色图例
      </Text>
      <VStack align="start" spacing={2}>
        {Object.entries(organLabels).map(([key, label]) => {
          const [r, g, b, a] = organColors[Number(key)];
          const rgba = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
          return (
            <HStack key={key} spacing={3}>
              <Box
                w="20px"
                h="20px"
                bg={rgba}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
              />
              <Text fontSize="sm">{label}</Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

export default OrganLegend;
