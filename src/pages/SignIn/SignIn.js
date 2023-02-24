import react from 'react';

function SignIn(){

    console.log(localStorage.getItem('accessToken'));
    if (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === "" ) {
        if(window.location.hash !== null  && window.location.hash !== "" ){
        localStorage.setItem('accessToken' , window.location.hash);
        } 
    }  
    if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === ""){
        window.location = 'https://ghg-web-app.auth.us-east-2.amazoncognito.com/login?client_id=4ldeiv7vnskn1so636vb4uojon&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome';
    }
}

export default SignIn