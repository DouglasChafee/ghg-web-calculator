import React, {useState} from 'react';
import HeroSection from '../../components/HeroSection';

function Landing({setLogInState, setLogOutState}) {
  document.title="GHG Web App"
  setLogInState("flex"); // enable sign-in button
  setLogOutState("none"); // disable sign-out button
    return (
      <>
      <HeroSection />
      </>
    );
  };
  
  export default Landing