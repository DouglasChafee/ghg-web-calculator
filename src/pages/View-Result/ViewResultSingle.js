import React from 'react';
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
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from '../../aws-exports';
Amplify.configure(awsExports);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.register(ArcElement, Tooltip, Legend);


  export const options = {
    plugins: {
      title: {
        display: true,
        text: '2019 Carbon Emissions',
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

  export const optionsPie = {
    plugins: {
      title: {
        display: true,
        text: '2019 Carbon Emissions',
      },
    },
    responsive: true,
   
  };

  
  const labels = ['fac 1', 'fac 2', 'fac 3', 'fac 4', 'fac 5', 'fac 6', 'fac 7'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Scope 1 Emissions',
        data: [5,2,1],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Scope 2 Emissions',
        data: [2,1,0],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      
    ],
  };

  
  export const pieData = {
    labels: ['Estimated Natural Gas', 'Estimated Refridgerants', 'Stationary Combustion', 'Mobile Combustion', 'Fugitive Emissions', 'Purchased Electricity'],
    datasets: [
      {
        label: 'Amount Of Emissions',
        data: [5, 2, 1, 2, 1, 0],
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

function ViewResultSingle(user){
   
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
           
           console.log(response)

         })
       }
    
    
    callAPI();

      
    return(
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
    );





}
export default withAuthenticator(ViewResultSingle)