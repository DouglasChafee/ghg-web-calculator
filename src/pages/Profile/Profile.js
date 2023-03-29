import React, { useEffect, useState } from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import { Authenticator, ThemeProvider, Flex, Card, Divider, Text, Heading} from '@aws-amplify/ui-react';
import { NavBtn, ButtonLinks} from "../../components/Navbar/NavBarElements";
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Amplify.configure(awsExports);
API.configure(awsExports);

function Profile({setLogInState, setLogOutState, theme, formFields}) {
    document.title="Profile"
    const [FName, setFName] = useState("")
    const [LName, setLName] = useState("")
    const [Email, setEmail] = useState("")
    const [Verified, setVerified] = useState("")
    const [GName, setGName] = useState("")
    const [GRole, setGRole] = useState("")

    // List of actions to preform once every page render
    useEffect(() => {
      setLogInState("none"); // disable sign-in button
      setLogOutState("flex"); // enable sign-out button
      callAPI() // Retrieve user profile info
    }, [])

    async function callAPI() {
      const user = await Auth.currentAuthenticatedUser()
      setFName(user.attributes.given_name);
      setLName(user.attributes.family_name);
      setEmail(user.attributes.email);
      setVerified(user.attributes.email_verified.toString())
      /*
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
      
      await API.get('api4ef6c8be', '/ghgReadUser', requestInfo).then((response) => { // Api get request
        console.log(response);
        console.log(user);
        setFName(response.name);
        setLName(response.name);
        setEmail(user.attributes.email);
        setVerified(user.attributes.email_verified.toString());
      })
      */
    }

    // Display user profile with data back on page
    return(
      <>
      <ThemeProvider theme={theme} >
        <Authenticator variation="modal" formFields={formFields}>
        <Flex direction="column" alignItems="center" wrap="wrap" marginTop="1rem" marginBottom="5rem">
          
          <Card variation='elevated' borderRadius="1rem" border="1px solid" paddingBottom="1px" paddingTop="1px" paddingLeft="10%" paddingRight="10%" >
            <Flex 
              direction="row"
              alignItems="center"
              >
              <h1>Profile - </h1>
              <NavBtn>
                <ButtonLinks to="/profile/update/password">Change Password</ButtonLinks>
              </NavBtn>
            </Flex>
            <Divider size="medium" display="flex" orientation="horizontal"/>
            <Flex direction="column"
              alignItems="center"
              >
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                First Name:
                </Heading>
                <Text margin="5px">{FName}</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                Last Name:
                </Heading>
                <Text margin="5px">{LName}</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                Email:
                </Heading>
                <Text margin="5px">{Email}</Text> 
              </Flex>
              <Flex 
                marginTop="1rem"
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                Verified:
                </Heading>
                <Text margin="5px">{Verified}</Text> 
              </Flex>
              <Flex 
                marginBottom="1.5rem" 
                >
                <NavBtn paddingTop="2rem">
                <ButtonLinks to="/profile/delete" marginBottom="1rem">Delete Account</ButtonLinks>
                </NavBtn>
                <NavBtn paddingTop="2rem">
                <ButtonLinks to="/profile/update/info" marginBottom="1rem">Update Information</ButtonLinks>
                </NavBtn>
              </Flex>
            </Flex>
          </Card>

          <Divider size="medium" display="flex" orientation="horizontal"/>
          
          <Card variation='elevated' borderRadius="1rem" border="1px solid" paddingBottom="1px" paddingTop="1px" paddingLeft="10%" paddingRight="10%" >
            <Flex 
              direction="row"
              alignItems="center"
              paddingLeft="7px"
              paddingRight="7px"
              >
              <h1>Group - </h1>
              <NavBtn>
                <ButtonLinks to="/">Create New Group</ButtonLinks>
              </NavBtn>
            </Flex>
            <Divider size="medium" display="flex" orientation="horizontal"/>
            <Flex direction="column"
              alignItems="flex-start"
              >
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                Name:
                </Heading>
                <Text margin="5px">{GName}</Text> 
              </Flex>
              <Flex 
                marginTop="1rem"
                marginBottom="1.5rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Heading width="6.5rem" borderRadius="10px 0px 0px 10px" paddingTop="5px" paddingBottom="5px" textAlign="center" backgroundColor="#01bf71">
                Role:
                </Heading>
                <Text margin="5px">{GRole}</Text> 
              </Flex>
            </Flex>
          </Card>

        </Flex>
        </ Authenticator>
      </ThemeProvider>
      </>
    );
}

export default (Profile)