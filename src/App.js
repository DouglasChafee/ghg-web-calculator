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
import Profile from './pages/Profile/Profile'
import ViewResultSingle from './pages/View-Result/ViewResultSingle'
import ViewResultMulti from './pages/View-Result/ViewResultMulti'
import UpdateInfo from './pages/UpdateProfile/UpdateInfo'
import UpdatePassword from './pages/UpdateProfile/UpdatePassword';
import DeleteAcc from './pages/UpdateProfile/DeleteAcc';


function App() {
  const [isOpen, setIsOpen] = useState(false) //closed drop down state
  const [logInState, setLogInState] = useState("flex")
  const [logOutState, setLogOutState] = useState("none")
  const toggle = () => { //switch sidebar drop down states
      setIsOpen(!isOpen)
  }

  return (
    <>
    <Router>
      <SideBar isOpen={isOpen} toggle={toggle} logInState={logInState} setLogInState={setLogInState} logOutState={logOutState} setLogOutState={setLogOutState}/>
      <Navbar toggle={toggle} logInState={logInState} setLogInState={setLogInState} logOutState={logOutState} setLogOutState={setLogOutState}/>
      <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/faq' element={<FAQ />} />
          <Route exact path='/contact' element={<Contact />} />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/home' element={<Home setLogInState={setLogInState} setLogOutState={setLogOutState}/>} />
          <Route exact path='/profile' element={<Profile setLogInState={setLogInState} setLogOutState={setLogOutState}/>} />
          <Route exact path='/ViewResultSingle' element={<ViewResultSingle />} />
          <Route exact path='/ViewResultMulti' element={<ViewResultMulti />} />
          <Route exact path='/profile/update/info' element={<UpdateInfo setLogInState={setLogInState} setLogOutState={setLogOutState}/>} />
          <Route exact path='/profile/update/password' element={<UpdatePassword setLogInState={setLogInState} setLogOutState={setLogOutState}/>} />
          <Route exact path='/profile/delete' element={<DeleteAcc setLogInState={setLogInState} setLogOutState={setLogOutState}/>} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
};

export default App;
