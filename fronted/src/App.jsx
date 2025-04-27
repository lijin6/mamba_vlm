import { Routes, Route } from "react-router-dom";
import Identify from "./components/Identify.jsx";
import HorizontalScroll from "./components/StaggeredScroll.jsx";
import About from "./components/about/index.jsx";
import FloatingNav from "./components/FloatingNav.jsx";
import Person from "./components/person/index.jsx";
import Home from "./components/Home.jsx";
import NavBar from "./components/NavBar.jsx";
import Pindex from "./components/person/components/Pindex.jsx"
import History from "./components/person/components/History.jsx"; 
import Echart from "./components/person/components/Echart.jsx";
import Building from "./components/Building.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
function App() {
  return (
    <>
      <ChakraProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="/test123" element={<HorizontalScroll />} />
          <Route path="/about" element={<About />} />
          <Route path="/person" element={<Person />}>
            <Route path="index" element={<Pindex />} />
            <Route path="history" element={<History />} />
            <Route path="echart" element={<Echart />} />
            <Route path="setting" element={<Building />} />
          </Route>
        </Routes>
        <FloatingNav />
      </ChakraProvider>
    </>
  );
}

export default App;
