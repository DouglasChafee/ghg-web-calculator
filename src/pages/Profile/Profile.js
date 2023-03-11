import React, { useEffect, useState } from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import { Flex, withAuthenticator, Divider } from '@aws-amplify/ui-react';
import { NavBtn, NavBtnLink } from "../../components/Navbar/NavBarElements";
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function Profile({ signOut, user, setLogInState, setLogOutState}) {
    const [data, setData] = useState("")

    // Retrieve user profile info once every page render
    useEffect(() => {
      console.log('attributes:', user.attributes); 
      //callAPI()
    }, [])
  
    setLogInState("none"); // on page render disable sign-in button
    setLogOutState("flex"); // on page render enable sign-out button
    async function callAPI() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken
      console.log({ token }) // log user token
      const requestInfo = {
        headers: { // pass user authorization token
          Authorization: token 
        },
        queryStringParameters: { // pass query parameters
          id: user.attributes.sub
        }
      };
      await API.get('api4ef6c8be', '/ghgReadUser', requestInfo).then((response) => {
        setData(response)
        console.log(response)
      })
    }

    // Display user profile with data back on page
    return(
        <>
          <Flex 
            direction="column"
            alignItems="center"
            justifyContent="space-around"
            paddingBottom={"1rem"}
            >
            <h1>Profile {data}</h1>
            <NavBtn>
              <NavBtnLink to="/">Update Account Infromation</NavBtnLink>
            </NavBtn>
            <Divider size="large" orientation="horizontal"/>
          </Flex>
          <Flex 
            direction="column"
            alignItems="center"
            justifyContent="space-around"
            paddingBottom={"20rem"}
            >
            <h1>Group</h1>
            <NavBtn>
              <NavBtnLink to="/">Create New Group</NavBtnLink>
            </NavBtn>
            <Divider size="large" orientation="horizontal"/>
          </Flex>
      </>
    );
}

export default withAuthenticator(Profile)