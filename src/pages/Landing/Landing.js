import React, {useState} from 'react';
import './Landing.css';
import logo from '../../assets/logo.svg';

const Landing = () => {
    return (
      <>
        <header className="Landing-header">
            <img src={logo} className="Landing-logo" alt="logo" />
            <p>
            Edit <code>src/pages/Landing/Landing</code> and save to reload.
            </p>
            <a
            className="Landing-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn React
            </a>
            <p>
            This is the Landing Page!
            </p>
        </header>
      </>
    );
  };
  
  export default Landing