import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing/Landing'
import FAQ from './pages/FAQ/FAQ'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Home from './pages/Home/Home'

function App() {
  return (
      <Router>
      <Navbar />
      <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/faq' element={<FAQ />} />
          <Route exact path='/contact' element={<Contact />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/home' element={<Home />} />
      </Routes>
      </Router>
  );
}

export default App;
