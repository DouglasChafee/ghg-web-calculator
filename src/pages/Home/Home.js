import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function Home({ signOut, user, setLogInState, setLogOutState}){
  setLogInState("none"); // on page render disable sign-in button
  setLogOutState("flex"); // on page render enable sign-out button
  return(
      <>
      <h1>Hello {user.attributes.email}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(Home)