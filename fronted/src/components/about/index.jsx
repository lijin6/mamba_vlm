'use client'

import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  Box,
} from '@chakra-ui/react'
import { IoAnalyticsSharp, IoLogoBitcoin, IoSearchSharp } from 'react-icons/io5'
import { BsLightning, BsUnion, BsRobot } from "react-icons/bs";
import ThreeGrid from './components/ThreeGrid'

const Feature = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex w={8} h={8} align={'center'} justify={'center'} rounded={'full'} bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  )
}

export default function About() {
  return (
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={'uppercase'}
            color={'blue.400'}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}>
            关于我们
          </Text>
          <Heading>基于Mamba块的MRI影像分析系统</Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
          在当今快速发展的医疗科技领域，精准诊断是实现个性化治疗的关键。为了应对传统的医学成像技术存在的挑战，我们推出了基于Mamba块的MRI影像分析系统，旨在为临床实践提供更加高效、准确的影像分析解决方案。
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />
            }>
            <Feature
              icon={<Icon as={BsLightning} color={'yellow.500'} w={5} h={5} />}
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'高处理速度'}
            />
            <Feature
              icon={<Icon as={BsUnion} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'高长程依赖关系的捕捉能力'}
            />
            <Feature
              icon={<Icon as={BsRobot} color={'purple.500'} w={5} h={5} />}
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'优秀多模态数据融合能力'}
            />
          </Stack>
        </Stack>
        <Flex>
          <Image
            rounded={'md'}
            alt={'feature image'}
            src={
              '/static/images/header3.png'
            }
            objectFit={'cover'}
          />
        </Flex>
      </SimpleGrid>
      <Box marginTop={'16'}>
        <ThreeGrid/>
      </Box>
    </Container>
  )
}