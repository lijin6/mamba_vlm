import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react'
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc'

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}

export default function ThreeGrid() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'高处理速度'}
          text={
            '基于Mamba块的MRI影像分析系统采用线性时间复杂度算法，显著提升了图像处理速度，实现了快速、高效的医学影像分析。'
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={'长关系捕获'}
          text={
            '该系统通过优化的状态空间模型，能够精准捕捉MRI影像中的长程依赖关系，提高病变检测和诊断的准确性。'
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'多模态融合'}
          text={
            '支持多种成像技术的数据整合，Mamba块在多模态MRI影像分析中表现出色，增强了综合诊断能力，为个性化治疗提供依据。'
          }
        />
      </SimpleGrid>
    </Box>
  )
}