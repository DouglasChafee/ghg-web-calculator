import React from 'react';
import { Amplify, Auth } from 'aws-amplify';

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Auth.configure(awsExports);


export default function Home({ signOut, user }){

        console.log(localStorage.getItem('accessToken'));

    return(
        
        <div style={{ display: "flex", flexDirection: 'column', position: 'relative', height: 600, alignItems:'center', justifyContent:'center'}}>
            <Authenticator variation="modal" signUpAttributes={['given_name', 'family_name']}>
                {({ signOut, user }) => (
                    <main>
                        <h1>Hello {user.username}</h1>
                        <button onClick={signOut}>Sign out</button>
                    </main>
                )}
            </ Authenticator>
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

