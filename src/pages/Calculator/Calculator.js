import React, { useState, useEffect } from 'react';
//import { Amplify, Storage, API, Auth } from 'aws-amplify';
import { withAuthenticator, Flex, FileUploader, Button, Text, ScrollView, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { Amplify, Storage, API } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

function About(){

    // The loading state when the file is being parsed
    const [LoadingState, setLoadingState] = useState(false)
    const [ClacDisabled, setCalcDisabled] = useState(false) // change to true
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
        addWarningMessage( [] )
        // Then call the api to parse the uploaded file
        
        
    };

    const onUploadError = (error) => {
        addWarningMessage([`${error}`]);
    };

    // Function for on error upload
    async function onFileError(key)   {
        // First set the loading state to false
        setLoadingState(false)
        // Disable the calculate button
        setCalcDisabled(true)
        // Then delete the file from the private bucket
        // Add an element to the message box
        addWarningMessage(
            WarningMessages.concat([
                <Card width={"700px"} height="2.5rem">
                    Error
                </Card>
            ])
        )
    }

    // A function which occurs upon returned success from the API
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

    async function results() {
        API.post('api4ef6c8be', '/ParseExcelAPI')
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
                    //width="auto"
                    //orientation='horizontal'
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
                    onClick={results()}
                    ariaLabel=""
                >
                    Calculate
                </Button>
            </Flex>
        </div>
    );
    
}

export default withAuthenticator(About)