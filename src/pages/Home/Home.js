import React from 'react';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../../aws-exports';
Amplify.configure(awsExports);


function Home({ signOut, user }){

        console.log(localStorage.getItem('accessToken'));

    return(
        
        <div style={{ display: "flex", flexDirection: 'column', position: 'relative', height: 600, alignItems:'center', justifyContent:'center'}}>
            <>
                <h1>Hello {user.attributes.email}</h1>
                <button onClick={signOut}>Sign out</button>
            </>
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

export default withAuthenticator(Home);