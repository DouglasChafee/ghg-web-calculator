import React from 'react'
import { 
    SideBarContainer,
    Icon,
    CloseIcon,
    SideBarWrapper,
    SideBarMenu,
    SideBarLink,
    SideBtnWrap,
    SideBarRoute
 } from './SideBarElements';

const SideBar = ({isOpen, toggle}) => {
  return (
    <SideBarContainer isOpen={isOpen} onClick={toggle}>
        <Icon onClick={toggle}>
            <CloseIcon />
        </Icon>
        <SideBarWrapper>
            <SideBarMenu>
                <SideBarLink to="about" onClick={toggle}>
                About
                </SideBarLink>
                <SideBarLink to="contact" onClick={toggle}>
                Contact
                </SideBarLink>
                <SideBarLink to="faq" onClick={toggle}>
                FAQ
                </SideBarLink>
            </SideBarMenu>
            <SideBtnWrap>
                <SideBarRoute to="/home">Sign In</SideBarRoute>
            </SideBtnWrap>
        </SideBarWrapper>
    </SideBarContainer>
  );
};

export default SideBar