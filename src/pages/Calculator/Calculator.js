import React, { useState } from 'react';
import { Flex, FileUploader, Button, Text, ScrollView, Card } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'
import { isDisabled } from '@testing-library/user-event/dist/utils';

function About(){

    // The loading state when the file is being parsed
    const [LoadingState, setLoadingState] = useState(false)
    const [ClacDisabled, setCalcDisabled] = useState(true)
    const [WarningMessages, addWarningMessage] = useState([])

    // On sucsessfull file upload
    async function onSuccess(key) {
        // First update the submit button to begin loading
        setLoadingState(true)
        // Then set the message to blank
        addWarningMessage( [] )
        // Then call the api to parse the uploaded file
        
        
    };

    // Function for on error upload
    async function onError(key)   {
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
                        onClick={() => alert('Downloading Template')}
                        ariaLabel=""
                        size="large"
                    >
                        Download Template
                    </Button>
                    <Button
                        loadingText=""
                        onClick={() => alert('Downloading Example')}
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
                    accessLevel="public"
                    onSuccess={onSuccess}
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
                    onClick={() => alert('File Sent')}
                    ariaLabel=""
                >
                    Calculate
                </Button>
            </Flex>
        </div>
    );
    
}

export default About