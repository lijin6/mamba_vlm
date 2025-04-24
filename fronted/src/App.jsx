import { Routes, Route } from 'react-router-dom';
import Identify from './components/identify/index.jsx'
import HorizontalScroll from './components/StaggeredScroll.jsx'
import About from './components/about/index.jsx'
import FloatingNav from './components/FloatingNav.jsx'
import Person from './components/person/index.jsx'
import Index from './components/index/index.jsx'
import NavBar from './components/NavBar.jsx'
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/identify" element={<Identify />} />
        <Route path="/test123" element={<HorizontalScroll />} />
        <Route path="/about" element={<About />} />
        <Route path="/person" element={<Person />}>
        </Route>
      </Routes>
      <FloatingNav />
    </>
  )
}

export default App