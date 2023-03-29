import React from 'react';
import { Expander, ExpanderItem, Flex, Heading, } from '@aws-amplify/ui-react';

function About({setLogInState, setLogOutState}){
    document.title="About"
    setLogInState("flex"); // enable sign-in button
    setLogOutState("none"); // disable sign-out button
    return(
        <div>
            <Flex
                marginLeft={"10%"}
                marginRight={"10%"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"18rem"}
                paddingTop={"1rem"}
                gap="1rem"
                direction="column" 
                maxWidth={"1100px"}
            >
                <Heading level={3} font-weight={"bold"}>About</Heading>
                <Expander type="multiple" // Expanding text box section
                // To change whether only one item can be opened at the same time
                // type="single"
                >
                    <ExpanderItem title="GHG Web Calculator" value="about-item-1">
                    With climate change being the forefront of everyone's mind, there is this increase in
                    responsibility for companies to start reporting their greenhouse gas (GHG) emissions annually.
                    The GHG Web Calculator is a free online web tool for small businesses to help automate GHG calculations. 
                    </ExpanderItem>
                    <ExpanderItem title="Yearly Calculations" value="about-item-2">
                        Currently, the GHG Web Calculator is capable of performing Scope 1 & 2 yearly calculations.
                        Utalizing either the manual or excel data entry facility data, stationary emission data,
                        mobile emission data, fugitives data, and purchased energy can be submitted for calculation.
                        After performing a Scope 1 & 2 calculation, the summary of the calculation will be stored.
                        These result summaries can be view and compared using your account.
                    </ExpanderItem>
                    <ExpanderItem
                    title="User Accounts" value="about-item-3">
                        User accounts allow you to track your yearly calculations using previous yearly history.
                        A single account is intended for use for a single companies GHG calculation.
                        To ceate an account, use this link to <a href="/">sign up</a>.
                    </ExpanderItem>
                    <ExpanderItem
                    title="User Groups" value="about-item-4">
                        User groups allow a collection of users to share yearly results data.
                        All users within a group share results history allowing a group to collaborate on GHG calculations.
                        Each group has a leader which manages the group and its members.
                        To learn more about how to create a group, how to invite members, or accept invitations
                        please view the <a href="/FAQ">FAQ</a>.
                    </ExpanderItem>
                </Expander>
            </Flex>
        </div>
    );
    
}

export default About