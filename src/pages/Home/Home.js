import React, {useEffect, useState} from 'react';
import { Amplify, Auth } from 'aws-amplify';

import { withAuthenticator, Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import style from '../../index.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Auth.configure(awsExports);

// making auth signin and signup button green
const theme = {
    name: 'button-theme',
    tokens: {
      colors: {
        border: {
          // this will affect the default button's border color
          primary: { value: 'black' },
        },
      },
      components: {
        button: {
          // this will affect the font weight of all button variants
          fontWeight: { value: '{fontWeights.extrabold}' },
          // style the primary variation
          primary: {
            backgroundColor: { value: '{colors.green.80}' },
            _hover: {
              backgroundColor: { value: '{colors.green.60}' },
            },
            _focus: {
              backgroundColor: { value: '{colors.green.60}' },
            },
            _active: {
              backgroundColor: { value: '{colors.green.90}' },
            },
          },
        },
        
      },
    },
  };

  // signup attributes specified as required or optional
  const formFields = {
    signUp: {
      email: {
        order: 1,
        isRequired: true
      },
      given_name: {
        order: 2,
        isRequired: true
      },
      family_name: {
        order: 3,
        isRequired: true
      },
      password: {
        order: 5,
        isRequired: true
      },
      confirm_password: {
        order: 6,
        isRequired: true
      }
    },
   }
  
export default function Home({ signOut, user, setLogInState, setLogOutState }){

  useEffect(() => {
    setLogInState("none"); // disable sign-in button
    setLogOutState("flex"); // enable sign-out button
  }, [])


    return(
        // formating the scope buttons to be centered in a column/vertical format
        <div style={{ display: "flex", flexDirection: 'column', position: 'relative', height: 600, alignItems:'center', justifyContent:'center'}}>
          
            <ThemeProvider theme={theme}>
                <Authenticator variation="modal" formFields={formFields}>
                    {({ signOut, user }) => (
                        <main>
                            <h1>Hello {user.attributes.email}</h1>
                            <button onClick={signOut}>Sign out</button>
                        </main>
                    )}
                </ Authenticator>
            </ThemeProvider>
            
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

