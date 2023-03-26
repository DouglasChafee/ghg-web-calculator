import React from 'react';
import { CheckboxField, useTheme, Divider, Flex, Heading, } from '@aws-amplify/ui-react';

    function ViewList() {
        const { tokens } = useTheme();
    return(
        <div>
            <Flex 
                marginLeft={"10%"}
                marginRight={"10%"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"15rem"}
                paddingTop={"1rem"}
                gap="1rem"
                direction="column" 
                alignItems="center"
            >
                
                <Heading level={3} font-weight={"bold"}>View Results</Heading>
                <Heading level={8} font-weight={"bold"}>Select the years you wish to view</Heading>
            
                <Divider orientation="horizontal" />
                <CheckboxField fontWeight={tokens.fontWeights.bold} label="2018" name="2018" value="yes"  /*yes is value passed, try to make into variable*/ size="large" />
                <Divider orientation="horizontal" />



                <CheckboxField fontWeight={tokens.fontWeights.bold} label="2019" name="2019" value="yes"  /*yes is value passed, try to make into variable*/ size="large" />
                <Divider orientation="horizontal" />
                <CheckboxField fontWeight={tokens.fontWeights.bold} label="2020" name="2020" value="yes"  /*yes is value passed, try to make into variable*/ size="large" />
                <Divider orientation="horizontal" />
                <CheckboxField fontWeight={tokens.fontWeights.bold} label="2021" name="2021" value="yes"  /*yes is value passed, try to make into variable*/ size="large" />
                <Divider orientation="horizontal" />
            </Flex>
        </div>
    );
    
    }



export default ViewList