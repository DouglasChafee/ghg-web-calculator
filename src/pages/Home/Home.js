import React, {useEffect, useState} from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { NavBtn, ButtonLinks} from "../../components/Navbar/NavBarElements";

import { withAuthenticator, Authenticator, ThemeProvider, View, Divider, Heading, Flex} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import style from '../../index.css';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
Auth.configure(awsExports);
  
function Home({setLogInState, setLogOutState, theme, formFields}){
  document.title="Home | GHG Web App"
  useEffect(() => {
    const user = Auth.currentAuthenticatedUser()
    setLogInState("none"); // disable sign-in button
    setLogOutState("flex"); // enable sign-out button
  }, [])


    return(
      <>
      <div style={{ display: "flex", flexDirection: 'column', alignItems:'center', justifyContent:'center',  marginBottom: "100px"}}>

      <ThemeProvider theme={theme} >
        <Authenticator variation="modal" formFields={formFields}>
        {({ user }) => (
          <Flex direction="column" alignItems="center" wrap="wrap" marginBottom="5rem">
            <View
              as="div"
              maxWidth="100%"
              padding="1rem"
            >
            <Heading level={1} fontWeight="medium" marginTop="1rem">Welcome Back ... {user.attributes.given_name + " " + user.attributes.family_name}</Heading>
            <Divider orientation="horizontal" size="large" />
            </View>
            <Flex direction="row" alignItems="center" wrap="wrap" justifyContent="center" >   
              <Flex direction="column" alignItems="center">
                  <NavBtn>
                      <ButtonLinks to="/calculator">Scope 1 & 2</ButtonLinks>
                  </NavBtn>
                  <NavBtn>
                      <ButtonLinks to="/ViewList">View Scope 1 & 2
                      Results</ButtonLinks>
                  </NavBtn>
              </Flex>
            </Flex>
            <Divider orientation="horizontal" width="20rem" size="small" label="OR" />
              <Flex direction="column" alignItems="center">
                  <NavBtn>
                      <ButtonLinks to="" >Scope 3</ButtonLinks>
                  </NavBtn>
                  <NavBtn>
                      <ButtonLinks to="">View Scope 3
                      Results</ButtonLinks>
                  </NavBtn>
              </Flex>
          </Flex>
        )}
      </ Authenticator>
    </ThemeProvider>
    </div>
     </>
    );

}

export default (Home)
