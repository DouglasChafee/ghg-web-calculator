import React, {useEffect , useState} from 'react';
import {Amplify, Auth, API} from 'aws-amplify';
import { withAuthenticator, Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {View, Flex, Card} from '@aws-amplify/ui-react';
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);
API.configure(awsExports);

//Returns random RGB value
function getRandomColorVal(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);

}


function ViewResultMulti({setLogInState, setLogOutState, theme, formFields}){
    const [responseData, setResponseData] = useState("");
    const [ItemLength, setItemLength] = useState("");
    const urlParams = new URLSearchParams(window.location.search);
    //var YEARS_SELECTED = [2015 , 2017, 2018, 2019, 2020, 2021, 2024];
    var YEARS_SELECTED = [];
    var YEARS_SELECTED_STRING = urlParams.get("Year").split(',');

    for(let i=0;i<YEARS_SELECTED_STRING.length;i++){
      YEARS_SELECTED.push(parseInt(YEARS_SELECTED_STRING[i]));

    }

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
          setResponseData(response);
          setItemLength(response.Items.length);
          })
        }

    useEffect(() => {
        callAPI();
        setLogInState("none"); // disable sign-in button
        setLogOutState("flex"); // enable sign-out button  
        }, [])

    
    
    //---------------------
    // GRAPH SETTINGS START
    //---------------------

    const optionsStacked = {
        plugins: {
          title: {
            display: true,
            text: 'All Emissions By Year - Stacked',
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
      
      //var labelsStack = ['2019', '2020'];
      
      var TOTAL_EMISSION = [];

      for(let i=0;i<YEARS_SELECTED.length;i++){
        let TOTAL_COMBUSTION = 0;
        let TOTAL_FUGITIVE = 0;
        let TOTAL_MOBILE = 0;
        let TOTAL_NATURAL_GAS = 0;
        let TOTAL_PURHCASED_ELECTRICITY = 0;
        let TOTAL_REFRIGERANTS = 0;

          for(let j=0;j<ItemLength;j++){
            if(responseData.Items[j].YEAR === YEARS_SELECTED[i]){
              TOTAL_COMBUSTION+=responseData.Items[j].COMBUSTION;
              TOTAL_FUGITIVE+=responseData.Items[j].FUGITIVE;
              TOTAL_MOBILE+=responseData.Items[j].MOBILE;
              TOTAL_NATURAL_GAS+=responseData.Items[j].NATURAL_GAS;
              TOTAL_PURHCASED_ELECTRICITY+=responseData.Items[j].PURCHASED_ELECTRICITY;
              TOTAL_REFRIGERANTS+=responseData.Items[j].REFRIGERANTS;
            }
          }
        TOTAL_EMISSION.push([TOTAL_NATURAL_GAS, TOTAL_REFRIGERANTS, TOTAL_COMBUSTION, TOTAL_MOBILE, TOTAL_FUGITIVE, TOTAL_PURHCASED_ELECTRICITY]);
      }
      console.log(TOTAL_EMISSION)

      var DATA_NATURAL_GAS = [];
      var DATA_REFRIGERANTS = [];
      var DATA_COMBUSTION = [];
      var DATA_MOBILE = [];
      var DATA_FUGITIVE = [];
      var DATA_PURCHASED = [];

      for(let i=0;i<YEARS_SELECTED.length;i++){
        DATA_NATURAL_GAS.push(TOTAL_EMISSION[i][0]);
        DATA_REFRIGERANTS.push(TOTAL_EMISSION[i][1]);
        DATA_COMBUSTION.push(TOTAL_EMISSION[i][2]);
        DATA_MOBILE.push(TOTAL_EMISSION[i][3]);
        DATA_FUGITIVE.push(TOTAL_EMISSION[i][4]);
        DATA_PURCHASED.push(TOTAL_EMISSION[i][5]);

      }

      const dataStacked = {
        labels: YEARS_SELECTED,
        datasets: [
          {
            label: 'Estimated Natural Gas',
            data: DATA_NATURAL_GAS,
            backgroundColor: 'rgb(255, 153, 153)',
          },
          {
            label: 'Estimated Refrigerants',
            data: DATA_REFRIGERANTS,
            backgroundColor: 'rgb(204, 255, 255)',
          },
          {
            label: 'Stationary Combustion',
            data: DATA_COMBUSTION,
            backgroundColor: 'rgb(255, 204, 153)',
          },
          {
            label: 'Mobile Combustion',
            data: DATA_MOBILE,
            backgroundColor: 'rgb(204, 255, 204)',
          },
          {
            label: 'Fugitive Emissions',
            data: DATA_FUGITIVE,
            backgroundColor: 'rgb(255, 255, 204)',
          },
          {
            label: 'Purchased Electricity',
            data: DATA_PURCHASED,
            backgroundColor: 'rgb(255, 204, 255)',
          },
        ],
      };

    
    const optionsGrouped = {
        plugins: {
          title: {
            display: true,
            text: 'All Emissions By Year - Grouped',
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
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
      
    const labelsGrouped = ['Estimated Natural Gas', 'Estimated Refrigerants', 'Stationary Combustion', 'Mobile Combustion', 'Fugitive Emission', 'Purchased Electricity'];
     
    var GROUPED_COLORS = ['rgb(255, 153, 153)', 'rgb(204, 255, 255)', 'rgb(255, 204, 153)', 'rgb(204, 255, 204)', 'rgb(255, 255, 204)', 'rgb(255, 204, 255)'];
    const dataGrouped = {
        labels: labelsGrouped,
        datasets: [],
      };
      let colorCounter=0;
      for(let i=0;i<YEARS_SELECTED.length;i++){
        /*
        CODE FOR RANDOMIZED COLOR ON BARS

        let red = getRandomColorVal(0, 255);
        let blue = getRandomColorVal(0, 255);
        let green = getRandomColorVal(0, 255);
        let colorString = "rgb(" + red + " ," + green + " ," + blue +")";

        REPLACE GROUPED_COLORS[colorCounter] WITH colorString AND DELETE COLORCOUNTER CODE TO USE
        */
        
        dataGrouped.datasets.push(
          {
            label: YEARS_SELECTED[i],
            data: TOTAL_EMISSION[i],
            backgroundColor: GROUPED_COLORS[colorCounter],
            stack: 'Stack ' + i,
          }
        )
        colorCounter+=1;
        if(colorCounter===6){
          colorCounter=1;
        }
      }
      
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
        paddingBottom={"0rem"}
        paddingTop="1rem"
      >
          <View
            height="40rem"
            width="50rem"
          >
            <Card variation='outlined'>
            <Bar 
            options={optionsStacked}
            data={dataStacked} />
            </Card>
          </View>
          <View
            height="40rem"
            width="50rem"
          >
            <Card variation='outlined'>
            <Bar 
            data={dataGrouped}
            options={optionsGrouped}
            />
            </Card>
          </View>
          
      </Flex>
      </ Authenticator>
      </ThemeProvider>
        

    );


}
export default (ViewResultMulti)