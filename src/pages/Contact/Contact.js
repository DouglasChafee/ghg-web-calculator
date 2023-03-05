import React from 'react';
import emailpng from './email.png';
import phonepng from './phone-call.png';
import addresspng from './maps-and-flags.png';
import {Flex, View, Heading, Divider} from '@aws-amplify/ui-react';

function Contact(){
    
    return(
        

            <div className = "contact">
                <Heading level={1} 
                    textAlign="center"
                    alignSelf="center"
                >
                Contact
                </Heading>
                <br/>
                <Flex
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="stretch"
                    alignContent="flex-start"
                    wrap="wrap"
                    gap="10rem"
                    paddingBottom={"10rem"}
                >
                <View>
                    <figure style={{display: 'inline-block'}}>
                        <img style={{width: 80, height: 80}} src={emailpng} Alt="Picture of a mail"/>
                        <Heading level={4}>By Mail</Heading>
                        <br/>
                        <Divider
                            orientation="horizontal" 
                        />
                        <br/>
                        <figcaption style={{width: 80, font: "Roboto", fontWeight: "150"}}>noorurrahman94@gmail.com <br/>18phl@queensu.ca<br/>18kwd1@queensu.ca<br/>18wbfi@queensu.ca<br/>18dsc1@queensu.ca<br/>17jdm9@queensu.ca </figcaption> 
                    </figure>
                    
                </View>
                
                <View>
                    <figure style={{display: 'inline-block'}}>
                        <img style={{width: 80, height:80}} src={phonepng} Alt="Picture of a phone"/>
                        <Heading level={4}>By Phone</Heading>
                        <br/>
                        <Divider
                            orientation="horizontal" 
                        />
                        <br/>
                        <figcaption style={{width: 80, font: "Roboto", fontWeight: "150"}}>1882334563</figcaption>
                    </figure>
                </View>
                
                <View>
                    <figure style={{display: 'inline-block'}}>
                        <img style={{width: 80, height: 80}} src={addresspng} Alt="Picture of a map flag"/>
                        <Heading level={4}>Address</Heading>
                        <br/>
                        <Divider
                            orientation="horizontal" 
                        />
                        <br/>
                        <figcaption style={{width: 80, font: "Roboto", fontWeight: "150"}}>Queen St, Toronto, ON, Canada</figcaption>
                    </figure>  
                </View>
                </Flex>
               
            
        </div>
        

    );
}

export default Contact