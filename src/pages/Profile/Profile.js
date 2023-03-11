import React, { useEffect, useState } from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import { withAuthenticator, Flex, Card, Divider, Text} from '@aws-amplify/ui-react';
import { NavBtn, ButtonLinks} from "../../components/Navbar/NavBarElements";
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function Profile({ signOut, user, setLogInState, setLogOutState}) {
    const [data, setData] = useState("")

    // Retrieve user profile info once every page render
    useEffect(() => {
      //console.log('attributes:', user.attributes); THIS MAKES THE COGINTO API CALL AUTOMATICALLY
      callAPI()
    }, [data])
  
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
        <Flex direction="column" alignItems="center" wrap="wrap" marginTop="1rem" marginBottom="5rem">
          
          <Card variation='elevated' borderRadius="1rem" border="1px solid" paddingBottom="1px" paddingTop="1px" paddingLeft="10%" paddingRight="10%" >
            <Flex 
              direction="row"
              alignItems="center"
              >
              <h1>Profile - </h1>
              <NavBtn>
                <ButtonLinks to="/">Update Information</ButtonLinks>
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
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>First Name: </Text>
                <Text margin="5px">Karl</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>Last Name: </Text>
                <Text margin="5px">Dorogy</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>Email: </Text>
                <Text margin="5px">karlwdorogy@gmail.com</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>Verified: </Text>
                <Text margin="5px">True</Text> 
              </Flex>
              <Divider marginBottom="1rem" size="medium" display="flex" orientation="horizontal"/>
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
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>Name: </Text>
                <Text margin="5px">GHG Developers</Text> 
              </Flex>
              <Flex 
                marginTop="1rem" 
                border="1px solid"
                borderRadius="10px" 
                width="100%"
                > 
                <Text padding="5px"  alignItems="center" borderRadius="10px 0px 0px 10px" borderRight="1px solid" backgroundColor="#01bf71" fontWeight={700}>Role: </Text>
                <Text margin="5px">Group Member</Text> 
              </Flex>
              <Divider marginBottom="1rem" size="medium" display="flex" orientation="horizontal"/>
            </Flex>
          </Card>

        </Flex>
      </>
    );
}

export default withAuthenticator(Profile)