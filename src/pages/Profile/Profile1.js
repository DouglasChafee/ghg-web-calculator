import React from 'react'
import {
    Flex,
    Heading,
    TextField,
    PasswordField,
    Button,
    Divider,
    Grid
  } from '@aws-amplify/ui-react';
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { User } from "../../models";
import { fetchByPath, validateField } from "../../ui-components/utils";
import { DataStore } from "aws-amplify";


export const Profile = () => {
    const [password, setPassword] = React.useState('');
    var myStr = '1234';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const passwordErrorMessage = `Requires uppercase, lowercase, and number with a minimum of 8 chars`;
    const compareErrorMessage = `New password does not match confirm password`;

    return (
      <Flex as="form" direction="column" gap="1rem">
        <Heading level={3}>Update Profile</Heading>
        <Divider orientation="horizontal" />
        <TextField label="Email" name="email" autoComplete="email@gmail.com" />
        <TextField label="First name" name="firstname" autoComplete="firstname" />
        <TextField label="Last name" name="firstname" autoComplete="firstname" />
        <PasswordField 
          label="Current password"
          name="current_password"
          descriptiveText="Password must be at least 8 characters"
        />
        <PasswordField
          onChange={(e) => {setPassword(e.target.value);}}
          label="New password"
          name="new_password"
          descriptiveText="Password must be at least 8 characters"
          value={password}
          hasError={!passwordRegex.test(password)}
          errorMessage={passwordErrorMessage}
        />
        <PasswordField
          label="Confirm password"
          name="confirm_password"
          hasError={myStr.match(password)}
          errorMessage={compareErrorMessage}
        />
        <Button type="submit" onClick={(e) => e.preventDefault()}>
          Update
        </Button>
      </Flex>
    );
    
};

export default Profile