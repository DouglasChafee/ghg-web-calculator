import * as React from "react";
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
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "../../ui-components/utils";
import { Amplify, API, Auth } from 'aws-amplify';
import { withAuthenticator, Authenticator, ThemeProvider} from '@aws-amplify/ui-react';
import awsExports from '../../aws-exports';
import {CognitoUserAttribute } from "amazon-cognito-identity-js";
Amplify.configure(awsExports);
API.configure(awsExports);

function UpdateInfo(props) {
  document.title="Update Info"
  var {
    user = Auth.currentAuthenticatedUser(),
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    theme, 
    formFields,
    setLogOutState, 
    setLogInState,
    ...rest
  } = props;
  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
  };
  const navigate = useNavigate();
  setLogInState("none"); // disable sign-in button
  setLogOutState("flex"); // enable sign-out button
  const [email, setEmail] = React.useState(initialValues.email);
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [errors, setErrors] = React.useState({});
  const [Loading, setLoading] = React.useState(false);

  const resetStateValues = () => {
    const cleanValues = initialValues;
    setEmail(cleanValues.email);
    setFirstName(cleanValues.firstName);
    setLastName(cleanValues.lastName);
    setErrors({});
  };

  React.useEffect(() => {
    callReadAPI() // fill initial text box values
  }, [])

  async function callReadAPI() {
    const user = await Auth.currentAuthenticatedUser();
    setEmail(user.attributes.email);
    setFirstName(user.attributes.given_name);
    setLastName(user.attributes.family_name);
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
      // setEmail(user.attributes.email);
      // setFirstName(user.attributes.given_name);
      // setLastName(user.attributes.family_name);
    })
    */
  }

  const validations = {
    email: [{ type: "Required" }, { type: "Email" }],
    firstName: [{ type: "Required" }],
    lastName: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value = getDisplayValue
      ? getDisplayValue(currentValue)
      : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };

  // Beginning of Update Profile Page Layout
  return (
    <ThemeProvider theme={theme} >
    <Authenticator variation="modal" formFields={formFields}>
    {({ user }) => (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      paddingBottom="15rem"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          email,
          firstName,
          lastName,
        };

        // Validate User Inputs
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        
        if (validationResponses.some((r) => r.hasError)) { // Some user input has errors
          return;
        }
        
        if (onSubmit) { // User has submitted input
          modelFields = onSubmit(modelFields);
        }

        // Update Backend with User Submitted Input
        try {
          setLoading(true)
          console.log(modelFields)
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });

          /*
          // THIS SECTION REQURES NEW COGINTO USER POOL TO BE CREATED AND INTERGRATED!
          // Attempt to update preferred username attribute holding alternative email:
          const email_attributes = [new CognitoUserAttribute({Name: "preferred_username", Value: email })];
          user.updateAttributes(email_attributes, (err, results) => {
            if (err) {
              console.error(err);
              alert(err);
            }
            else {
              console.log(results);
              alert("User Email Update was Successful");
            }
          });
          */

          // Attempt to Update Other user attributes:
          // In cognito userpool
          const attributes = [
            new CognitoUserAttribute({Name: "given_name", Value: firstName }),
            new CognitoUserAttribute({Name: "family_name", Value: lastName }),
          ];
          await user.updateAttributes(attributes, (err, results) => {
            if (err) {
              console.error(err);
              setLoading(false)
              alert(err);
            }
            else {
              console.log(results);
              setLoading(false)
              alert("User Profile Update was Successful");
              navigate("/profile");
            }
          });
          // In DynamoDB tables
          // await CALL UPDATE USER API HERE !!!!    
          // setLoading(false)

          if (onSuccess) {
            onSuccess(modelFields);
            
          }
        } catch (err) {
          if (onError) {
            setLoading(false)
            onError(modelFields, err.message);
            alert(err);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserUpdateForm")}
      {...rest}
    >
      <Heading
        level={3}
        children="Update Profile Information"
        {...getOverrideProps(overrides, "SectionalElement1")}
      ></Heading>
      <Divider
        orientation="horizontal"
        {...getOverrideProps(overrides, "SectionalElement0")}
      ></Divider>

      {/* 
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={true}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              firstName,
              lastName,
              currentPassword,
              password,
              confirmPassword,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField> 
      */}

      <TextField
        label="First name"
        isRequired={true}
        isReadOnly={false}
        value={firstName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              firstName: value,
              lastName,
            };
            const result = onChange(modelFields);
            value = result?.firstName ?? value;
          }
          if (errors.firstName?.hasError) {
            runValidationTasks("firstName", value);
          }
          setFirstName(value);
        }}
        onBlur={() => runValidationTasks("firstName", firstName)}
        errorMessage={errors.firstName?.errorMessage}
        hasError={errors.firstName?.hasError}
        {...getOverrideProps(overrides, "firstName")}
      ></TextField>

      <TextField
        label="Last name"
        isRequired={true}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              firstName,
              lastName: value,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
            console.log(errors.lastName?.hasError)
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>

      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Flex
        justifyContent="space-between"
      >
        <CancelButton to="/profile" primary="true" dark="false">
        Cancel
        </CancelButton>
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(user)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        </Flex>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Update"
            type="submit"
            variation="primary"
            isLoading={Loading}
            isDisabled={
              !(user) || 
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
        
      </Flex>
    </Grid>
    )}
    </ Authenticator>
    </ThemeProvider>
  );
}

export default (UpdateInfo)