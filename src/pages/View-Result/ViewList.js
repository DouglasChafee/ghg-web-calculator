import React, { useEffect, useState } from 'react';
import { NavBtn, ButtonLinks} from "../../components/Navbar/NavBarElements";
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
            if(sel.length === 0){  // If no buttons pressed disable submit button
                let get = document.getElementsByClassName("Button");
                get.setAttribute('disabled',true);
            }
            if(sel.length === 1){
                // Create URL with years attached
                let Values = new URL("http://" + window.location.host+"/ViewResultSingle");
                Values.searchParams.set("Year",sel);
                window.location=Values;
            }
            else{
                // Create URL with years attached
                let Values = new URL("http://" + window.location.host+"/ViewResultMulti");
                Values.searchParams.set("Year",sel);
                window.location=Values;
            }
        }

        // When delete button is pressed, deletes checked elements
        const onDelete = (event) => {
            console.log("WORKS");
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
            items.sort();
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
                </form>
                <Flex 
                direction="row"
                >
                
                <form onSubmit={onSubmit}>
                    {/* <NavBtn> */}
                        <Button class="Button" type="submit" style={
                            {
                                backgroundColor:"#01BF71",
                                border: "none",
                                borderRadius: "20px",
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: "Bold",
                                color: 'Black'
                            } 
                        }
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = 'black'
                            e.target.style.color="#01BF71"
                        
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = '#01BF71'
                            e.target.style.color="Black"
                        }
                        }
                        >Submit</Button>
                        {/* <ButtonLinks class="Button" type="submit">Submit</ButtonLinks> */}
                        {/* <Button class="Button" type="submit">Delete</Button> */}
                    {/* </NavBtn> */}
                </form>

                <form onDelete={onDelete}>
                    {/* <NavBtn> */}
                        <Button class="Button" type="submit" style={
                            {
                                backgroundColor:"#01BF71",
                                border: "none",
                                borderRadius: "20px",
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontWeight: "Bold",
                                color: 'Black'
                            } 
                        }
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = 'black'
                            e.target.style.color="#01BF71"
                        
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = '#01BF71'
                            e.target.style.color="Black"
                        }
                        }>Delete</Button>
                        {/* <ButtonLinks class="Button" type="submit">Submit</ButtonLinks> */}
                        {/* <Button class="Button" type="submit">Delete</Button> */}
                    {/* </NavBtn> */}
                </form>
                </Flex>

                <div>
                    <Flex
                        paddingBottom={"5rem"}
                    ></Flex>
                </div>

            </Flex>
        </div>
    );
    
    }



export default ViewList