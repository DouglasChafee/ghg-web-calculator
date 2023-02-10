import React from 'react';
import './Landing.css';
import logo from '../../assets/logo.svg';

function Landing(){
    return(
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                Edit <code>src/pages/Landing/Landing</code> and save to reload.
                </p>
                <a
                className="App-link"
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
        </div>
    );
}

export default Landing