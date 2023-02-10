import React from 'react'
import {animateScroll as scroll} from 'react-scroll'
import { 
    FooterContainer, 
    FooterWrap, 
    FooterLinksContainer, 
    FooterLinksWrapper, 
    FooterLinkItems, 
    FooterLinkTitle,
    FooterLink,
    Company,
    CompanyWrap,
    CompanyLogo,
    WebsiteRights
} from './FooterElements'

const toggleHome = () => {
    scroll.scrollToTop();
  };

const Footer = () => {
  return (
    <FooterContainer>
        <FooterWrap>
            <FooterLinksContainer>
            {/* // info column 1 */}
                <FooterLinksWrapper>
                <FooterLinkItems>
                    <FooterLinkTitle> About Us</FooterLinkTitle>
                        <FooterLink to="/about">What is this?</FooterLink>
                        <FooterLink to="/about">How it works</FooterLink>
                        <FooterLink to="/about">Investors</FooterLink>
                        <FooterLink to="/about">Careers</FooterLink>
                        <FooterLink to="/about">Terms of Service</FooterLink>
                </FooterLinkItems>
                </FooterLinksWrapper>

                {/* // info column 2 */}
                <FooterLinksWrapper>
                <FooterLinkItems>
                    <FooterLinkTitle> Contact Us</FooterLinkTitle>
                        <FooterLink to="/FAQ">Contact</FooterLink>
                        <FooterLink to="/FAQ">Support</FooterLink>
                        <FooterLink to="/FAQ">FAQ</FooterLink>
                        <FooterLink href="//www.youtube.com" target="_blank" aria-label='Youtube'>Helpful Videos</FooterLink>
                </FooterLinkItems>
                </FooterLinksWrapper>
            </FooterLinksContainer> 

            <Company>
                <CompanyWrap>
                    <CompanyLogo exact to="/" onClick={toggleHome}>
                        GHG
                    </CompanyLogo>
                    <WebsiteRights>GHG © {new Date().getFullYear()} All rights reserved.</WebsiteRights>
                </CompanyWrap>
            </Company>

        </FooterWrap>
    </FooterContainer>
  )
}

export default Footer