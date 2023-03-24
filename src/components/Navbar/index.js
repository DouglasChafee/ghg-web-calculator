import React from 'react';
import { FaBars } from "react-icons/fa";
import {animateScroll as scroll} from 'react-scroll'
import { 
  Nav, 
  NavbarContainer, 
  NavLogo, 
  MobileIcons, 
  NavMenu, 
  NavItem, 
  NavLinks,
  SignInNavBtn,
  NavBtnLink
} from "./NavBarElements";
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function toggleHome() {
  scroll.scrollToTop();
};

function Navbar({toggle, logInState, setLogInState, logOutState, setLogOutState}) {

  function signOutHandler() {
    try {         
      Auth.signOut();
      setLogInState("flex");
      setLogOutState("none");
    }
    catch(e) {
      console.log("An Error Occured While trying to Signing out" + e)
    }
  }
  
  return (
    
    <>
      <Nav>
        <NavbarContainer>
          <NavLogo exact to="/" onClick={toggleHome}>GHG</NavLogo>
          <MobileIcons onClick={toggle}>
            <FaBars />
          </MobileIcons>
          <NavMenu>
            <NavItem>
              <NavLinks to="home">Home</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="about">About</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="contact">Contact</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="faq">FAQ</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="profile">Profile</NavLinks>
            </NavItem>
          </NavMenu>
          <SignInNavBtn display={logInState}>
            <NavBtnLink to="home">Sign in</NavBtnLink>
          </SignInNavBtn>
          <SignInNavBtn display={logOutState}>
            <NavBtnLink to="/" onClick={signOutHandler}>Sign out</NavBtnLink>
          </SignInNavBtn>
        </NavbarContainer>
      </Nav>
    </>
  );
};
  
export default Navbar;
