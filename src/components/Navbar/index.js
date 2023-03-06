import React from "react";
import { FaBars } from "react-icons/fa";
import {animateScroll as scroll} from 'react-scroll'
import logo from '../../assets/logo.svg';
import { 
  Nav, 
  NavbarContainer, 
  NavLogo, 
  MobileIcons, 
  NavMenu, 
  NavItem, 
  NavLinks,
  NavBtn,
  NavBtnLink
} from "./NavBarElements";

const toggleHome = () => {
  scroll.scrollToTop();
};

const Navbar = ({toggle}) => {
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
              <NavLinks to="about">About</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="contact">Contact</NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to="faq">FAQ</NavLinks>
            </NavItem>
          </NavMenu>
          <NavBtn>
            <NavBtnLink to="home">Sign in</NavBtnLink>
          </NavBtn>
        </NavbarContainer>
      </Nav>
    </>
  );
};
  
export default Navbar;
