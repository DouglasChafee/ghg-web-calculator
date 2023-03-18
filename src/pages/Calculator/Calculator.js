import React from 'react';
import { Flex, FileUploader, Button, } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'

function About(){
    return(
        <div>
            <Flex
            
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
                        loadingText=""
                        onClick={() => alert('downloading template')}
                        ariaLabel=""
                        size="large"
                    >
                        Download Template
                    </Button>
                    <Button
                        loadingText=""
                        onClick={() => alert('downloading example')}
                        ariaLabel=""
                        size="large"
                    >
                        Download Example
                    </Button>
                </Flex>
                <FileUploader
                    hasMultipleFiles={false}
                    showImages={false}
                    acceptedFileTypes={['.xlsx']}
                    accessLevel="public"
                />
            </Flex>
        </div>
    );
    
}

export default About