import React, {useEffect , useState} from 'react';
import {Amplify, Auth, API} from 'aws-amplify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
import { Bar, Pie} from 'react-chartjs-2';
import {View, Flex, Card, Button} from '@aws-amplify/ui-react';
import { withAuthenticator, Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
API.configure(awsExports);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);

function ViewResultSingle({setLogInState, setLogOutState, theme, formFields}){
     
  const [ItemLength, setItemLength] = useState("");
  const [responseData, setResponseData] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  var YEAR_SELECTED = parseInt(urlParams.get("Year")); 
  const labels=[]; // # of Facilities for Bar Graph
  
  var TOTAL_COMBUSTION = 0;
  var TOTAL_FUGITIVE = 0;
  var TOTAL_MOBILE = 0;
  var TOTAL_NATURAL_GAS = 0;
  var TOTAL_PURHCASED_ELECTRICITY = 0;
  var TOTAL_REFRIGERANTS = 0;
  
  
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
      
      console.log(response);
      setItemLength(response.Items.length);
      setResponseData(response);

      })
    }

    useEffect(() => {
      callAPI();
      setLogInState("none"); // disable sign-in button
      setLogOutState("flex"); // enable sign-out button   
    }, [])
      
    
    //console.log("responseData test: " + responseData.Items[0].YEAR);
    
    // Number of facilities = response item length
    // Also assigning total vals by adding up all vals
    var facNum=0;
    for(let i=0;i<ItemLength;i++){
      if(responseData.Items[i].YEAR === YEAR_SELECTED){
        console.log("ADDING RESPONSE ID " + responseData.Items[i].id + " FROM YEAR " + responseData.Items[i].YEAR + " TO TOTALS");
        facNum = facNum + 1;
        labels.push("Facility " + facNum);
        
        TOTAL_COMBUSTION+=responseData.Items[i].COMBUSTION;
        TOTAL_FUGITIVE+=responseData.Items[i].FUGITIVE;
        TOTAL_MOBILE+=responseData.Items[i].MOBILE;
        TOTAL_NATURAL_GAS+=responseData.Items[i].NATURAL_GAS;
        TOTAL_PURHCASED_ELECTRICITY+=responseData.Items[i].PURCHASED_ELECTRICITY;
        TOTAL_REFRIGERANTS+=responseData.Items[i].REFRIGERANTS;
        
      }
    }
    
    //console.log("Total Combustion: " + TOTAL_COMBUSTION);

    // Creating Scope 1 and Scope 2 totals
    var barDataScope1=[];
    var barDataScope2=[];
    for(let i=0;i<ItemLength;i++){
      if(responseData.Items[i].YEAR === YEAR_SELECTED){
        barDataScope1.push(responseData.Items[i].COMBUSTION + responseData.Items[i].FUGITIVE + responseData.Items[i].MOBILE);
        barDataScope2.push(responseData.Items[i].NATURAL_GAS + responseData.Items[i].PURCHASED_ELECTRICITY + responseData.Items[i].REFRIGERANTS);
      }
    }
    


    //----------------------
    // GRAPH SETTINGS START
    //----------------------
    const pieData = {
      labels: ['Estimated Natural Gas', 'Estimated Refrigerants', 'Stationary Combustion', 'Mobile Combustion', 'Fugitive Emissions', 'Purchased Electricity'],
      datasets: [
        {
          label: 'Emissions',
          data: [TOTAL_NATURAL_GAS, TOTAL_REFRIGERANTS, TOTAL_COMBUSTION, TOTAL_MOBILE, TOTAL_FUGITIVE, TOTAL_PURHCASED_ELECTRICITY],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const data = {
      labels,
      datasets: [
        {
          label: 'Scope 1 Emissions',
          data: barDataScope1,
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Scope 2 Emissions',
          data: barDataScope2,
          backgroundColor: 'rgb(75, 192, 192)',
        },
        
      ],
    };
    
    const optionsPie = {
      plugins: {
        title: {
          display: true,
          text:  YEAR_SELECTED + ' Carbon Emissions',
        },
      },
      responsive: true,
     
    };

    const options = {
      plugins: {
        title: {
          display: true,
          text: YEAR_SELECTED + ' Carbon Emissions',
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          title:{
            display: true,
            text: "CO2e",
          },
          stacked: true,
        },
      },
      
    };
    //---------------------
    // GRAPH SETTINGS END
    //---------------------
      
    return(
      <ThemeProvider theme={theme} >
      <Authenticator variation="modal" formFields={formFields}>
      <Flex
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        alignContent="flex-start"
        wrap="wrap"
        gap="1rem"
        paddingBottom={"10rem"}
        paddingTop="1rem"
      >
          <View
            height="50rem"
            width="75rem"
          >
            <Card variation='outlined'>
            <Bar 
            options={options}
            data={data} />
            </Card>
          </View>
          <View
            height="40rem"
            width="38.5rem"
          >
            <Card variation='outlined'>
            <Pie 
            data={pieData}
            options={optionsPie}
            />
            </Card>
          </View>
          
      </Flex>
      </ Authenticator>
      </ThemeProvider>  
    );





}
export default (ViewResultSingle)