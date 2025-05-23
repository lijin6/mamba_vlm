import { 
  Flex, Box, Button, Text, Stack, 
  useColorModeValue, IconButton, Collapse 
} from '@chakra-ui/react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle'; // Dark/Light 切换组件

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation(); // 获取当前路由

  const navItems = [
    { name: '首页', path: '/' },
    { name: '影像识别', path: '/identify' },
    { name: '测试页面', path: '/test123' },
    { name: '关于我们', path: '/about' },
    { name: '个人中心', path: '/person' }
  ];

  return (
    <Box 
      as="nav" 
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Box>
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color={useColorModeValue('blue.600', 'blue.400')}
            as={Link}
            to="/"
          >
            MambaMRI
          </Text>
        </Box>

        {/* Desktop Navigation */}
        <Flex display={{ base: 'none', md: 'flex' }} ml={10} align="center">
          <Stack direction="row" spacing={4}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.name}
                  as={Link}
                  to={item.path}
                  variant="ghost"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  color={isActive ? 'blue.500' : undefined}
                  _hover={{
                    bg: useColorModeValue('blue.50', 'blue.900'),
                    color: 'blue.500'
                  }}
                  _focus={{
                    boxShadow: isActive ? '0 0 0 2px rgba(66,153,225,0.6)' : undefined
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Stack>
          <ThemeToggle ml={4} />
        </Flex>

        {/* Mobile menu button */}
        <Flex display={{ md: 'none' }} align="center">
          <ThemeToggle mr={2} />
          <IconButton
            icon={isMenuOpen ? <FiX /> : <FiMenu />}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            aria-label="Toggle menu"
          />
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isMenuOpen} animateOpacity>
        <Box 
          pb={4}
          display={{ md: 'none' }}
          bg={bgColor}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Stack as="nav" spacing={1} px={4}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.name}
                  as={Link}
                  to={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  color={isActive ? 'blue.500' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  _hover={{
                    bg: useColorModeValue('blue.50', 'blue.900'),
                    color: 'blue.500'
                  }}
                  _focus={{
                    boxShadow: isActive ? '0 0 0 2px rgba(66,153,225,0.6)' : undefined
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default NavBar;
