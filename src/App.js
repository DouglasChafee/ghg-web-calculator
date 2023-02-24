import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar'
import Footer from './components/Footer'
import Landing from './pages/Landing/Landing'
import FAQ from './pages/FAQ/FAQ'
import Contact from './pages/Contact/Contact'
import About from './pages/About/About'
import Home from './pages/Home/Home'
import SignIn from './pages/SignIn/SignIn';

function App() {
  const [isOpen, setIsOpen] = useState(false) //closed drop down state

    const toggle = () => { //switch drop down states
        setIsOpen(!isOpen)
    }

  return (
    <>
    <Router>
      <SideBar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/faq' element={<FAQ />} />
          <Route exact path='/contact' element={<Contact />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/signin' element={<SignIn />} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
};

export default App;
