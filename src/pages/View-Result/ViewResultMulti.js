import React, {useEffect , useState} from 'react';
import {Amplify, Auth, API} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from '../../aws-exports';
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
import {View, Flex, Card, Button} from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

function getRandomColorVal(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);

}


function ViewResultMulti(){
    const [responseData, setResponseData] = useState("");

    var YEARS_SELECTED = [2019, 2020];
    var YEARS_SELECTED_STRING = "";

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
    
          })
        }

    useEffect(() => {
        callAPI(); 
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
            stacked: true,
          },
        },
      };
      
      var labelsStack = ['2019', '2020'];
      
      const dataStacked = {
        labels: labelsStack,
        datasets: [
          {
            label: 'Estimated Natural Gas',
            data: [1, 2, 3],
            backgroundColor: 'rgb(255, 153, 153)',
          },
          {
            label: 'Estimated Refrigerants',
            data: [7, 5, 3],
            backgroundColor: 'rgb(204, 255, 255)',
          },
          {
            label: 'Stationary Combustion',
            data: [3, 4, 3],
            backgroundColor: 'rgb(255, 204, 153)',
          },
          {
            label: 'Mobile Combustion',
            data: [1, 2, 3],
            backgroundColor: 'rgb(204, 255, 204)',
          },
          {
            label: 'Fugitive Emissions',
            data: [1, 9, 9],
            backgroundColor: 'rgb(255, 255, 204)',
          },
          {
            label: 'Purchased Electricity',
            data: [1, 2, 3],
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
            stacked: true,
          },
        },
      };
      
    const labelsGrouped = ['Estimated Natural Gas', 'Estimated Refrigerants', 'Stationary Combustion', 'Mobile Combustion', 'Fugitive Emission', 'Purchased Electricity'];
     
    
    const dataGrouped = {
        labels: labelsGrouped,
        datasets: [
          {
            label: '2019',
            data: [1, 2, 3, 7, 2, 3],
            backgroundColor: 'rgb(255, 99, 132)',
            stack: 'Stack 0',
          },
          {
            label: '2020',
            data: [1, 2, 3, 8, 1, 6],
            backgroundColor: 'rgb(75, 192, 192)',
            stack: 'Stack 1',
          },
        ],
      };
    
      let red = getRandomColorVal(0, 255);
      let blue = getRandomColorVal(0, 255);
      let green = getRandomColorVal(0, 255);
      let colorString = "rgb(" + red + " ," + green + " ," + blue +")";
      dataGrouped.datasets.push({
        label: '2021',
        data:[4, 3, 2, 1, 5, 7],
        backgroundColor: colorString,
        stack: 'Stack 2',

    })

    //---------------------
    // GRAPH SETTINGS END
    //---------------------



    return(
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
        

    );


}
export default withAuthenticator(ViewResultMulti)