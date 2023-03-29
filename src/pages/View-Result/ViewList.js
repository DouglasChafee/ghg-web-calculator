import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Amplify, Auth, API} from 'aws-amplify';
import { Authenticator, ThemeProvider, Collection, Card, Button, CheckboxField, useTheme, Flex, Heading, } from '@aws-amplify/ui-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
API.configure(awsExports);

function ViewList({setSelectedYears, setLogInState, setLogOutState, theme, formFields}) {
    document.title="Year List"
    const navigate = useNavigate();

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
            alert("Please Select at least one Year");
        }
        if(sel.length === 1){
            setSelectedYears(sel)
            navigate("/ViewResultSingle");
        }
        else {
            setSelectedYears(sel)
            navigate("/ViewResultMulti");
        }
    }

    // When delete button is pressed, deletes checked elements
    const onDelete = () => {
        const sel = [];
        const idSel = [];
        for(let element of document.getElementsByClassName("Year")){
            if(element.checked){
                sel.push(element.value);
            }
        }
        for(let i = 0; i < itemlength; i++){
            if(sel.includes(String(responsedata.Items[i].YEAR))){
                idSel.push(responsedata.Items[i].id);
            }
        }
        console.log(idSel);

        if(sel.length === 0){  // If no buttons pressed disable delete button
            let get = document.getElementsByClassName("Button");
            get.setAttribute('disabled',true);
        }
        deleteAPI(idSel);
    }

    // API call
    const { tokens } = useTheme();
    const [responsedata, setresponsedata] = useState("");
    const [itemlength, setitemlength] = useState("");

    // Gather user information
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
        setLogInState("none"); // disable sign-in button
        setLogOutState("flex"); // enable sign-out button 
    }, [])

    // Delete Selected Years
    async function deleteAPI(idSel) {
        const user = await Auth.currentAuthenticatedUser()
        console.log(user.attributes.sub)
        const token = user.signInUserSession.idToken.jwtToken
        console.log({ token })
        console.log(idSel);
        const requestInfo = {
            headers: {
            Authorization: token
            },
            queryStringParameters: { 
            idList: JSON.stringify(idSel)
            }
        };
        await API.get('api4ef6c8be', '/ghgDeleteYear', requestInfo).then((response) => {
            let Values = new URL(window.location.href);
            window.location=Values;
            console.log(response);
        })
        }

       // Gathers unique years from user's database (callAPI)
       const items = [];
       for(let i = 0; i < itemlength; i++){
            if(items.includes(responsedata.Items[i].YEAR) === false){
            items.push(responsedata.Items[i].YEAR);
            items.sort();
            }
       }

    return(
        <ThemeProvider theme={theme} >
        <Authenticator variation="modal" formFields={formFields}>
        <div>
            <Flex 
                marginLeft={"10%"}
                marginRight={"10%"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"16rem"}
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
                        gap="0.5rem"
                        direction={"column"}
                        wrap="wrap"
                        paddingBottom={"3rem"}
                        >
                        {(item, index) => (  // Loops to display each Year from items list as Checkboxes

                            <Card key={index} padding="1rem" fontWeight={tokens.fontWeights.bold} fontSize="30px">
                            <CheckboxField type="checkbox" style={{width:"25px", height:"25px"}} class="Year" fontWeight={tokens.fontWeights.bold} label={item} name={"Year"} value={item} size="large" />
                            </Card>
                        )}
                    
                    </Collection>
                </form>
                <Flex 
                direction="row"
                >
                        <Button class="Button" type="submit" onClick={() => onDelete()} style={  // When Delete button clicked call onDelete function
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

                <form onSubmit={onSubmit}>
                        <Button class="Button" type="submit" style={  // Upon clicking submit onSubmit event calls onSubmit
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
                        }>Submit</Button>
                </form>
            </Flex>

                <div>
                    <Flex
                        paddingBottom={"0rem"}
                    ></Flex>
                </div>

            </Flex>
        </div>
        </ Authenticator>
      </ThemeProvider>
    );
    
    }



export default ViewList