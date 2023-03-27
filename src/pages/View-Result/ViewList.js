import React, { useEffect, useState } from 'react';
import { Auth, API} from 'aws-amplify';
import { Collection, Card, Button, CheckboxField, useTheme, Divider, Flex, Heading, } from '@aws-amplify/ui-react';

    function ViewList() {



        const sel = [];
        const onSubmit = (event) => {
            event.preventDefault();
            //alert(event.target.Year.value);
            if(sel.includes(event.target.Year.value) == false){
                sel.push(event.target.Year.value);
            }
            console.log("Test " + sel);
          };

          const onSend = (event) => {
            alert(sel);
        }
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

       
       const items = [];
       for(let i = 0; i < itemlength; i++){
            if(items.includes(responsedata.Items[i].YEAR) == false){
            items.push(responsedata.Items[i].YEAR);
            }
       }
       console.log("Goodbye " + items);

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
            


                <Collection
                items={items}
      gap="1.5rem"
      direction={"row"}
      wrap="wrap"
      paddingBottom={"11rem"}

    >
      {(item, index) => (
        
        <Card key={index} padding="1rem">
    <form onSubmit={onSubmit}>

        <CheckboxField type="submit" fontWeight={tokens.fontWeights.bold} label={item} name={"Year"} value={item} size="large" />
        </form>


        </Card>
      )}
      
    </Collection>
    
    <form onSubmit={onSend}>
    <Button type="submit">Submit</Button>
    </form>



            </Flex>
        </div>
    );
    
    }



export default ViewList