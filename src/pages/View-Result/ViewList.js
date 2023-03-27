import React, { useEffect, useState } from 'react';
import { Auth, API} from 'aws-amplify';
import { Collection, Card, Button, CheckboxField, useTheme, Flex, Heading, } from '@aws-amplify/ui-react';

    function ViewList() {


        // When submit button is pressed, adds checked elements to a list and sends
        const onSubmit = (event) => {
            const sel = [];
            event.preventDefault();
            for(let element of document.getElementsByClassName("Year")){
                if(element.checked){
                    sel.push(element.value);
                }
            }
            alert(sel);
        }

        // API call
        const { tokens } = useTheme();
        const [responsedata, setresponsedata] = useState("");
        const [itemlength, setitemlength] = useState("");

        async function callAPI() {
            const user = await Auth.currentAuthenticatedUser()
            console.log(user.attributes.sub)
            const userSub = user.attributes.sub
            const token = user.signInUserSession.idToken.jwtToken
            console.log({ token })
            const requestInfo = {
              headers: {
                Authorization: token
              },
              queryStringParameters: { 
                userID: userSub
              }
            };
            await API.get('api4ef6c8be', '/ghgViewResultSingle', requestInfo).then((response) => {
              setresponsedata(response);
              setitemlength(response.Items.length);
              console.log(response);
   
            })
          }
          useEffect(() => {
            callAPI(); 
            }, [])

       // Gathers unique years from user's database
       const items = [];
       for(let i = 0; i < itemlength; i++){
            if(items.includes(responsedata.Items[i].YEAR) === false){
            items.push(responsedata.Items[i].YEAR);
            }
       }

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
            
                <form onSubmit={onSubmit}>

                    <Collection
                        items={items}
                        gap="1.5rem"
                        direction={"row"}
                        wrap="wrap"
                        paddingBottom={"3rem"}
                        >
                        {(item, index) => (

                            <Card key={index} padding="1rem" fontWeight={tokens.fontWeights.bold} fontSize="30px">
                            <CheckboxField type="checkbox" style={{width:"25px", height:"25px"}} class="Year" fontWeight={tokens.fontWeights.bold} label={item} name={"Year"} value={item} size="large" />
                            </Card>
                        )}
                    
                    </Collection>
                    
                    <Button type="submit">Submit</Button>

                    <div>
                        <Flex
                        paddingBottom={"5rem"}
                        ></Flex>
                    </div>

                </form>
            </Flex>
        </div>
    );
    
    }



export default ViewList