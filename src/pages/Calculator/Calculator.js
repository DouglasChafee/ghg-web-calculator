import React, { useState, useEffect } from 'react';
import { withAuthenticator, Flex, FileUploader, Button, Text, ScrollView, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { Amplify, Storage, API, Auth } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

function About(){

    // The loading state when the file is being parsed
    const [LoadingState, setLoadingState] = useState(false)
    const [ClacDisabled, setCalcDisabled] = useState(true)
    const [WarningMessages, addWarningMessage] = useState([])

    // Download Funciton for the template
    async function downloadTemplateOnClick() {
        // Download the file using the blob downloader
        const file = await Storage.get("S1&2_Data_Collection_Template.xlsx", {
            level: "public", download:true
        });
        downloadBlob(file.Body, "S1&2_Data_Collection_Template.xlsx");
    }

    // Download Funciton for the example
    async function downloadExampleOnClick() {
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
        setLoadingState(true)
        // Then set the message to blank
        const c = await Storage.get(key, {
            level:'private'
          });
        addWarningMessage( [
            <Card width={"900px"} height="2.5rem">
                <Text color="green">{c}</Text>
            </Card>
        ] )
        // Then call the api to parse the uploaded file
        CallParseAPI(key)
    };

    // Call the Parse API
    async function CallParseAPI(key) {
        // First get the auth of the user
        const user = await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        // Create the request info
        const requestInfo = {
            headers: { // pass user authorization token
              Authorization: token 
            },
            queryStringParameters: { // pass query parameters
              key
            }
        };
        await API.get('api4ef6c8be', '/ParseExcelAPI', requestInfo).then((response) => { // Api get request
            console.log(response);
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
    async function onFileError(key)   {
        // First set the loading state to false
        setLoadingState(false)
        // Disable the calculate button
        setCalcDisabled(true)
        // Then delete the file from the private bucket
        // Add an element to the message box
        addWarningMessage(
            WarningMessages.concat([
                <Card width={"900px"} height="2.5rem">
                    <Text color="red">There was an unexpected error when uploading your file.</Text>
                </Card>
            ] )
        )
    }

    // A function which occurs upon returned sucsess from the API
    async function onFileReady(key)   {
        // First display the message on sucsess
        addWarningMessage( [
            <Card width={"700px"} height="2.5rem">
                <Text color="green">Success. Ready to calculate.</Text>
            </Card>
        ] )
        // Then stop the loading state
        setLoadingState(false)
        // Then enable the calculate button
        setCalcDisabled(false)
    }

    return(
        <div>
            <Flex
                // Flex container for entire page
                marginLeft={"auto"}
                marginRight={"auto"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"2rem"}
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
                    loadingText = "Parsing File"
                    onClick={() => alert('File Sent')}
                    ariaLabel=""
                >
                    Calculate
                </Button>
            </Flex>
            
        </div>
    );
    
}

export default withAuthenticator(About)