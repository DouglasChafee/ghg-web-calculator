import * as React from "react";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  PasswordField,
} from "@aws-amplify/ui-react";
import {CancelButton} from '../../components/ButtonElement';
import { useNavigate } from "react-router-dom";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { fetchByPath, validateField } from "../../ui-components/utils";
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator, Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

function UpdatePassword(props) {
  const {
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
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };
  const navigate = useNavigate();
  setLogInState("none"); // disable sign-in button
  setLogOutState("flex"); // enable sign-out button
  var passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  const passwordErrorMessage = `Requires uppercase, lowercase, and number with a minimum of 8 chars`;
  const compareErrorMessage = `New password does not match confirm password`;
  const [currentPassword, setCurrentPassword] = React.useState(initialValues.currentPassword);
  const [password, setPassword] = React.useState(initialValues.password);
  const [confirmPassword, setConfirmPassword] = React.useState(initialValues.confirmPassword);
  const [errors, setErrors] = React.useState({});
  const [Loading, setLoading] = React.useState(false);

  const validations = {
    currentPassword: [{ type: "Required" }],
    password: [{ type: "Required" }],
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

  // Beginning of Update Password Page Layout
  return (
    <ThemeProvider theme={theme} >
    <Authenticator variation="modal" formFields={formFields}>
    {({ user }) => (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          currentPassword,
          password,
          confirmPassword,
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

          // Attempt to Update Password:
          await user.changePassword(currentPassword, password, (err, result) => {
            if (err) {
              console.error(err);
              setLoading(false)
              alert(err);
            }
            else {
              console.log(result);
              setLoading(false)
              alert("User Password Update was Successful");
              navigate("/profile");
            }
          });

          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          setLoading(false)
          if (onError) {
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
        children="Change Password"
        {...getOverrideProps(overrides, "SectionalElement1")}
      ></Heading>
      <Divider
        orientation="horizontal"
        {...getOverrideProps(overrides, "SectionalElement0")}
      ></Divider>

      <PasswordField
        label="Current Password"
        descriptiveText=""
        isRequired={true}
        isReadOnly={false}
        defaultValue={currentPassword}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              currentPassword: value,
              password,
              confirmPassword,
            };
            const result = onChange(modelFields);
            value = result?.currentPassword ?? value;
          }
          if (errors.currentPassword?.hasError) {
            runValidationTasks("password", value);
          }
          setCurrentPassword(value);
        }}
        onBlur={() => runValidationTasks("password", currentPassword)}
        errorMessage={errors.currentPassword?.errorMessage}
        hasError={errors.currentPassword?.errorMessage}
        {...getOverrideProps(overrides, "currentPassword")}
      ></PasswordField>

      <PasswordField
        label="New Password"
        descriptiveText="Password must be at least 8 characters and include an uppercase, lowercase, numeral, and special symbol"
        isRequired={true}
        isReadOnly={false}
        defaultValue={password}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              currentPassword,
              password: value,
              confirmPassword,
            };
            const result = onChange(modelFields);
            value = result?.password ?? value;
          }
          if (errors.password?.hasError) {
            runValidationTasks("password", value);
          }
          setPassword(value);
        }}
        onBlur={() => runValidationTasks("password", password)}
        errorMessage={passwordErrorMessage}
        hasError={!(passwordRegex.test(password))}
        {...getOverrideProps(overrides, "password")}
      ></PasswordField>

      <PasswordField
        label="Confirm Password"
        descriptiveText="Please re-type the password again to confirm"
        isRequired={true}
        isReadOnly={false}
        defaultValue={confirmPassword}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              currentPassword,
              password,
              confirmPassword: value,
            };
            const result = onChange(modelFields);
            value = result?.confirmPassword ?? value;
          }
          if (errors.confirmPassword?.hasError) {
            runValidationTasks("password", value);
          }
          setConfirmPassword(value);
        }}
        onBlur={() => runValidationTasks("password", password)}
        errorMessage={compareErrorMessage}
        hasError={!(confirmPassword === password)}
        {...getOverrideProps(overrides, "password")}
      ></PasswordField>

      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <CancelButton to="/profile" primary="true" dark="false">
        Cancel
        </CancelButton>
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
              !(passwordRegex.test(password)) ||
              !(confirmPassword === password) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
        
      </Flex>
    </Grid>
    )}
    </Authenticator>
    </ThemeProvider>
  );
}

export default (UpdatePassword)
