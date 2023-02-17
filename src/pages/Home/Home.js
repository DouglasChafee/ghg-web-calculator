import React from 'react';


function Home(){

    console.log(localStorage.getItem('accessToken'));
    if (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === "" ) {
        if(window.location.hash !== null  && window.location.hash !== "" ){
        localStorage.setItem('accessToken' , window.location.hash);
        } 
    }  
    if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === ""){
        window.location = 'https://ghg-web-app.auth.us-east-2.amazoncognito.com/login?client_id=4ldeiv7vnskn1so636vb4uojon&response_type=token&scope=ghg-web-app/dev+ghg-web-app&redirect_uri=http://localhost:3000/';
    }else{

    return(
        <div style={{ display: "flex", flexDirection: 'column', position: 'relative', height: 600, alignItems:'center', justifyContent:'center'}}>
            <button 
            onClick={() => alert('Scope 1 & 2 under development')}>
                Scope 1 & 2
            </button>
            &nbsp;
            <button 
            onClick={() => alert('Scope 1 & 2 Results is under development')}>
                View Scope 1 & 2
                Results
            </button>
        </div>
    );
    }
}

export default Home;