import React from "react";
import logo from '../../assets/logo.svg';
import { Nav, NavLink} from "./NavBarElements";
  
const Navbar = () => {
  return (
      <Nav>
        <NavLink to="/">
          {/* <img src={logo} alt=""/> */}
          Landing
        </NavLink>
        <NavLink to="/about" activeStyle>
          About
        </NavLink>
        <NavLink to="/contact" activeStyle>
          Contact Us
        </NavLink>
        <NavLink to="/faq" activeStyle>
          FAQ
        </NavLink>
        <NavLink to="/home" activeStyle>
          Home
        </NavLink>
      </Nav>
  );
};
  
export default Navbar;