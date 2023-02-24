import React, {useState} from 'react'
import Video from '../../assets/mountains.mp4'
import {Button} from '../ButtonElement'
import { 
    HeroContainer, 
    HeroBg, 
    VideoBg,
    HeroContent,
    HeroH1,
    HeroP,
    HeroBtnWrapper,
    ArrowFoward,
    ArrowRight
} from './HeroElements';

const HeroSection = () => {

    const [hover, setHover] = useState(false)

    const onHover = () => {
        setHover(!hover)
    }

  return (
    <HeroContainer id="homescroll">
        <HeroBg>
            <VideoBg autoPlay loop muted src={Video} type='video/mp4'/>
        </HeroBg>
        <HeroContent>
            <HeroH1>Green House Gas Reporting Made Easy</HeroH1>
            <HeroP>
               -Sign up for a new account today and get started-
            </HeroP>
            <HeroBtnWrapper>
                <Button to="signin" onMouseEnter={onHover} 
                onMouseLeave={onHover}
                primary="true"
                dark="true">
                    Get Started {hover ? <ArrowFoward /> : <ArrowRight/>}
                </Button>
            </HeroBtnWrapper>
        </HeroContent>
    </HeroContainer>
  )
}

export default HeroSection