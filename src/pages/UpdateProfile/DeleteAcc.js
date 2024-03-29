import React, {useState} from 'react';
import {
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  TextField,
} from "@aws-amplify/ui-react";
import {CancelButton} from '../../components/ButtonElement'
import { useNavigate } from "react-router-dom";
import { Amplify, API, Auth } from 'aws-amplify';
import { Authenticator, ThemeProvider} from '@aws-amplify/ui-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
API.configure(awsExports);

function DeleteAcc({setLogInState, setLogOutState, theme, formFields}) {
  document.title="Delete Account | GHG Web App"
  const user = Auth.currentAuthenticatedUser();
  const navigate = useNavigate();
  setLogInState("none"); // disable sign-in button
  setLogOutState("flex"); // enable sign-out button
  const [confirmation, setConfirmation] = React.useState("");
  const [Loading, setLoading] = React.useState(false);
  var facilitiesIDs = [];

  async function callAPI() {
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken
    await getFacilitiesAPI();
    console.log(user);
    console.log(facilitiesIDs);
    console.log({ token }) // log user token
    const requestInfo = {
      headers: { // pass user authorization token
        Authorization: token 
      },
      queryStringParameters: { // pass query parameters
        id: user.attributes.sub,
        idList: JSON.stringify(facilitiesIDs)
      }
    };
    
    await API.get('api4ef6c8be', '/ghgDeleteUser', requestInfo).then((response) => { // Api get request
      console.log(response);
    })
    
  }

  // Gather facility information
  async function getFacilitiesAPI() {
    const user = await Auth.currentAuthenticatedUser()
    console.log(user.attributes.sub)
    const userSub = user.attributes.sub
    const token = user.signInUserSession.idToken.jwtToken
    console.log({ token })
    const requestInfo = {
        headers: {
        Authorization: token
        },
        queryStringParameters: { 
        userID: userSub
        }
    };
    await API.get('api4ef6c8be', '/ghgViewResultSingle', requestInfo).then((response) => {
      for(let i = 0; i < response.Items.length; i++){
        facilitiesIDs.push(response.Items[i].id);
      }
    })
    }

  // Beginning of Delete Account Page Layout
  return (
    <ThemeProvider theme={theme} >
    <Authenticator variation="modal" formFields={formFields}>
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      paddingBottom="20rem"
      onSubmit={async (event) => {
        event.preventDefault();

        // Update Backend
        try {
          setLoading(true)
          console.log("Attempting Deletion")
          
          // In DynamoDB tables and Cognito User Pool
          await callAPI();
          setLoading(false)  
          Auth.signOut(); // auto sign user out
          setLogInState("flex"); // enable sign-in button
          setLogOutState("none"); // disable sign-out button
          alert("Account Deletion was Successful");
          navigate("/");

        } catch (err) {
            setLoading(false)
            alert(err);
        }
      }}
    >
      <Heading
        level={3}
        children="Delete Account"
      ></Heading>
      <Divider
        orientation="horizontal"
      ></Divider>

      <TextField
        descriptiveText="Are you sure you want to delete your account? If so, please type 'Confirm' as shown below ..."
        value={confirmation}
        onChange={(e) => {
          let { value } = e.target;
          setConfirmation(value);
        }}
        errorMessage={""}
        hasError={!(confirmation === 'Confirm') }
      ></TextField>

      <Flex
        justifyContent="space-between"
      >
        <CancelButton to="/profile" primary="true" dark="false">
        Cancel
        </CancelButton>
        <Flex 
          gap="15px"
        >
          <Button
            children="Delete"
            type="submit"
            variation="primary"
            isLoading={Loading}
            isDisabled={
              !(user) || 
              !(confirmation === 'Confirm')
            }
          ></Button>
        </Flex> 
      </Flex>
    </Grid>
    </ Authenticator>
    </ThemeProvider>
  );
}

export default (DeleteAcc)