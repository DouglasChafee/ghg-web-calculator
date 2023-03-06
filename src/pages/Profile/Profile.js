import React, { useEffect, useState } from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function Profile({ signOut, user }) {

    const [data, setData] = useState("") 
  
    async function callAPI() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken
      console.log({ token })
      const requestInfo = {
        headers: {
          Authorization: token
        },
        // queryStringParameters: { // 1. pass parameters here
        //   email: 'karlwdorogy@gmail.com'
        // }
        queryStringParameters: { // 1. pass parameters here
          id: '0113e00f-96e2-46c2-b3cb-50d04d3bf1b5'
        }
      };
      await API.get('api4ef6c8be', '/ghgReadUser', requestInfo).then((response) => {
        setData(response)
        console.log(response)
      })
    }

    // 3. display data back on page
    return(
        <>
        <h1>Profile {data}</h1>
        <button onClick={callAPI}>Call API</button>
        <button onClick={signOut}>Sign out</button>
      </>
    );
}

export default withAuthenticator(Profile)