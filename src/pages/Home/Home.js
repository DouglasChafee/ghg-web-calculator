import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function Home({ signOut, user, setLogInState, setLogOutState}){

  // List of actions to preform once every page render
  useEffect(() => {
    setLogInState("none"); // disable sign-in button
    setLogOutState("flex"); // enable sign-out button
    console.log(user.attributes)
  }, [])

  return(
      <>
      <h1>Welcome Back ... {user.attributes.email}</h1>
    </>
  );
}

export default withAuthenticator(Home)