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
import { Amplify, Auth } from 'aws-amplify';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

const SideBar = ({isOpen, toggle, logInState, setLogInState, logOutState, setLogOutState}) => {

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
        <SideBarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SideBarWrapper>
                <SideBarMenu>
                    <SideBarLink to="home" onClick={toggle}>
                    Home
                    </SideBarLink>
                    <SideBarLink to="about" onClick={toggle}>
                    About
                    </SideBarLink>
                    <SideBarLink to="contact" onClick={toggle}>
                    Contact
                    </SideBarLink>
                    <SideBarLink to="faq" onClick={toggle}>
                    FAQ
                    </SideBarLink>
                    <SideBarLink to="profile" onClick={toggle}>
                    Profile
                    </SideBarLink>
                </SideBarMenu>
                <SideBtnWrap>
                    <SideBarRoute to="/home" display={logInState}>Sign In</SideBarRoute>
                </SideBtnWrap>
                <SideBtnWrap>
                    <SideBarRoute to="/" onClick={signOutHandler} display={logOutState}>Sign Out</SideBarRoute>
                </SideBtnWrap>
            </SideBarWrapper>
        </SideBarContainer>
    );
    };

export default SideBar