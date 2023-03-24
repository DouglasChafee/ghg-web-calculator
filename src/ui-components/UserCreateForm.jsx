/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { User } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function UserCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    isLeader: false,
    groupID: "",
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [password, setPassword] = React.useState(initialValues.password);
  const [firstName, setFirstName] = React.useState(initialValues.firstName);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [isLeader, setIsLeader] = React.useState(initialValues.isLeader);
  const [groupID, setGroupID] = React.useState(initialValues.groupID);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setEmail(initialValues.email);
    setPassword(initialValues.password);
    setFirstName(initialValues.firstName);
    setLastName(initialValues.lastName);
    setIsLeader(initialValues.isLeader);
    setGroupID(initialValues.groupID);
    setErrors({});
  };
  const validations = {
    email: [{ type: "Required" }, { type: "Email" }],
    password: [{ type: "Required" }],
    firstName: [{ type: "Required" }],
    lastName: [{ type: "Required" }],
    isLeader: [{ type: "Required" }],
    groupID: [],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          email,
          password,
          firstName,
          lastName,
          isLeader,
          groupID,
        };
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
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new User(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserCreateForm")}
      {...rest}
    >
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              password,
              firstName,
              lastName,
              isLeader,
              groupID,
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
      <TextField
        label="Password"
        isRequired={true}
        isReadOnly={false}
        value={password}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              password: value,
              firstName,
              lastName,
              isLeader,
              groupID,
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
        errorMessage={errors.password?.errorMessage}
        hasError={errors.password?.hasError}
        {...getOverrideProps(overrides, "password")}
      ></TextField>
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
              password,
              firstName: value,
              lastName,
              isLeader,
              groupID,
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
              password,
              firstName,
              lastName: value,
              isLeader,
              groupID,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
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
      <SwitchField
        label="Is leader"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isLeader}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              email,
              password,
              firstName,
              lastName,
              isLeader: value,
              groupID,
            };
            const result = onChange(modelFields);
            value = result?.isLeader ?? value;
          }
          if (errors.isLeader?.hasError) {
            runValidationTasks("isLeader", value);
          }
          setIsLeader(value);
        }}
        onBlur={() => runValidationTasks("isLeader", isLeader)}
        errorMessage={errors.isLeader?.errorMessage}
        hasError={errors.isLeader?.hasError}
        {...getOverrideProps(overrides, "isLeader")}
      ></SwitchField>
      <TextField
        label="Group id"
        isRequired={false}
        isReadOnly={false}
        value={groupID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              password,
              firstName,
              lastName,
              isLeader,
              groupID: value,
            };
            const result = onChange(modelFields);
            value = result?.groupID ?? value;
          }
          if (errors.groupID?.hasError) {
            runValidationTasks("groupID", value);
          }
          setGroupID(value);
        }}
        onBlur={() => runValidationTasks("groupID", groupID)}
        errorMessage={errors.groupID?.errorMessage}
        hasError={errors.groupID?.hasError}
        {...getOverrideProps(overrides, "groupID")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
