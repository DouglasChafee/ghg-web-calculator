import React, { useState, useEffect } from 'react';
import { withAuthenticator, Authenticator, ThemeProvider, Flex, FileUploader, Button, Text, ScrollView, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { Amplify, Storage, API, Auth } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);
API.configure(awsconfig);
Storage.configure(awsconfig);

var fileKey;
var file;

function Calculator({setLogInState, setLogOutState, theme, formFields}){

    document.title="Calculator"
    useEffect(() => {
        setLogInState("none"); // disable sign-in button
        setLogOutState("flex"); // enable sign-out button
    }, [])

    // The loading state when the file is being parsed
    const [LoadingState, setLoadingState] = useState(false)
    const [ClacDisabled, setCalcDisabled] = useState(true)
    const [LoadingDisplayText, setLoadingDisplayText] = useState("Parsing File")
    const [WarningMessages, addWarningMessage] = useState([])
    const navigate = useNavigate();

    // Download Funciton for the template
    async function downloadTemplateOnClick() {
        // Download the file using the blob downloader
        console.log( Auth.configure() )
        const file = await Storage.get("S1&2_Data_Collection_Template.xlsx", {
            level: "public", download:true
        });
        downloadBlob(file.Body, "S1&2_Data_Collection_Template.xlsx");
    }

    // Download Funciton for the example
    async function downloadExampleOnClick() {
        console.log( Auth.configure() )
        // Download the file using the blob downloader
        const file = await Storage.get("S1&2_Example_Data.xlsx", {
            level: "public", download:true
        });
        downloadBlob(file.Body, "S1&2_Example_Data.xlsx");
    }

    // Download the file within the page
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
      }
      

    // On sucsessfull file upload
    async function onSuccess(key) {
        // First update the submit button to begin loading
        fileKey = key
        setLoadingState(true)
        setLoadingDisplayText("Parsing File")

        // Then set the message to blank
        addWarningMessage( [ ] )
        // Then call the api to parse the uploaded file
        CallParseAPI(key)
    };

    // Call the Parse API
    async function CallParseAPI(key) {
        file = await Storage.get("S1&2_Example_Data.xlsx", {
        level: "private"
    });
        
        // First get the auth of the user
        const user = await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        console.log({ token }) // log user token
        const postInfo = {
        headers: { // pass user authorization token
            Authorization: token 
            },
                queryStringParameters: { // pass query parameters
                userID: user.attributes.sub,
                s3FileKey : file
            }   
        };
        await API.get('api4ef6c8be', '/ParseExcelAPI', postInfo).then((response) => { // Api get request
            console.log(response);
            // Given the response call an error or on sucsess
            if(response.isValid) {
                // Call the on sucsess function
                onFileReady(response.errorList);
            }
            else {
                // Otherwise call on error
                // And send the list of error strings
                onFileError(response.errorList);
            }
        })
    };

    // Function for on error upload
    const onUploadError = (error) => {
        // First get the message as a string
        const message = `${error}`
        // Start the message
        addWarningMessage(
            [ <Card width={"900px"} height="2.5rem">
                <Text color="red">There was an unexpected error when uploading your file.</Text>
            </Card> ]
        )
        // Then display the error
        addWarningMessage(
            WarningMessages.concat([
                <Card width={"900px"} height="2.5rem">
                    <Text color="red">Error: {message}</Text>
                </Card>
            ] )
        )
    };

    // After upload on check, when there are issues with the file
    function onFileError(errors)   {
        // First set the loading state to false
        setLoadingState(false)
        // Disable the calculate button
        setCalcDisabled(true)
        // Add an element to the message box
        addMessagesFromList(errors, "red")
    }

    // A function which occurs upon returned sucsess from the API
    async function onFileReady(warning)   {
        // Stop the loading state
        setLoadingState(false)
        // Then enable the calculate button
        setCalcDisabled(false)
        // Add an element to the message box
        addMessagesFromList(warning, "orange")
    }

    // Add all messages in a list to the messages object list
    function addMessagesFromList(messages, color_word) {
        // Hold the list of messages
        let messagesObjects = []
        // For each message
        for (let index = 0; index < messages.length; ++index) {
            // Add an message to the list of messages
            messagesObjects = messagesObjects.concat( [
                    <Card width={"900px"} height="2.5rem">
                        <Text color={color_word}>{messages[index]}</Text>
                    </Card>
                ] ) ;
        }
        // End by appending the messages
        addWarningMessage( messagesObjects )
    }

    async function results(key) {
        setLoadingDisplayText("Calculating")
        setLoadingState(true)
        const user = await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        console.log({ token }) // log user token
        const postInfo = {
        headers: { // pass user authorization token
          Authorization: token 
        },
        queryStringParameters: { // pass query parameters
          userID: user.attributes.sub,
          s3FileKey : file
        }
      };
        await API.get('api4ef6c8be', '/ghgScope1and2Calculator', postInfo).then((response) => { // Api get request
            console.log(response);
            setLoadingState(false)
            alert("Calculations Were Successful");
            navigate("/home");
          })
    }

    return(
        <ThemeProvider theme={theme} >
        <Authenticator variation="modal" formFields={formFields}>
        <div>
            <Flex
                // Flex container for entire page
                marginLeft={"auto"}
                marginRight={"auto"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"12rem"}
                paddingTop={"2rem"}
                gap="1rem"
                direction="column" 
                maxWidth={"980px"}
            >
                <Flex
                    // Flex container for the two download buttons
                    marginLeft={"auto"}
                    marginRight={"auto"}
                    display={"flex"}
                    justifyContent="center"
                    wrap="wrap"
                    //gap="1rem"
                    columnGap={"2rem"}
                    direction="row"
                >
                    <Button
                        // The download template button
                        loadingText=""
                        onClick={() => downloadTemplateOnClick()}
                        ariaLabel=""
                        size="large"
                    >
                        Download Template
                    </Button>
                    <Button
                        loadingText=""
                        onClick={() => downloadExampleOnClick()}
                        ariaLabel=""
                        size="large"
                    >
                        Download Example
                    </Button>
                </Flex>

                <FileUploader
                    // The file uploader object which is always there
                    hasMultipleFiles={false}
                    showImages={false}
                    maxSize={1000000}
                    acceptedFileTypes={['.xlsx']}
                    accessLevel="private"
                    onSuccess={onSuccess}
                    onError={onUploadError}
                />

                <ScrollView 
                    // This scroll view is where all the returned errors are displayed
                    id="MessageBox"
                    width="auto"
                > 
                    { WarningMessages.map(warningText => warningText) }
                </ScrollView>

                <Button
                    id='calculateButton'
                    // The submit calculation button
                    isDisabled={ClacDisabled}
                    isLoading={LoadingState}
                    variation="primary"
                    size="large"
                    loadingText = {LoadingDisplayText}
                    onClick={() => {
                        results(fileKey);
                      }}
                    ariaLabel=""
                >
                    Calculate
                </Button>
            </Flex>
        </div>
    </Authenticator>
    </ThemeProvider>
    );
    
}

export default (Calculator)