import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import Identify from './views/identify/index.jsx'
import HorizontalScroll from './components/StaggeredScroll.jsx'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

createRoot(document.getElementById('root')).render(
  <Router>
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/" element={<Indentify />} /> */}
      </Routes>
      <Routes>
        <Route path="/identify" element={<Identify />} />
      </Routes>
      <Routes>
        <Route path="/test123" element={<HorizontalScroll />} />
      </Routes>
    </ChakraProvider>
  </StrictMode>,
  </Router>
)
