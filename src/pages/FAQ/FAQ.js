import React from 'react';
import { Expander, ExpanderItem, Flex, Heading, } from '@aws-amplify/ui-react';



function FAQ(){
    return(
        <div>
            <Flex
                marginLeft={"10%"}
                marginRight={"10%"}
                display={"flex"}
                position={"center"}
                paddingLeft={"2rem"}
                paddingRight={"2rem"}
                paddingBottom={"2rem"}
                paddingTop={"1rem"}
                gap="1rem"
                direction="column" 
                maxWidth={"1100px"}
            >
                <Heading level={3} font-weight={"bold"}>FAQ</Heading>
                <Expander type="multiple" defaultValue={["about-item-1","about-item-2","about-item-6","about-item-7","about-item-8","about-item-9","about-item-10","about-item-11","about-item-12","about-item-13"]} // defaultValue starts the listed items open
                // Expanding text box section
                // To change whether only one item can be opened at the same time
                // type="single"
                >
                    
                    <ExpanderItem title="Groups" value="about-item-1">
                    <ExpanderItem title="Q: How do I Create a Group?" value="about-item-6">
                        A: Under the group info section of your profile page, click "Create Group" and follow the subuqent prompts.
                    </ExpanderItem>
                    <ExpanderItem title="Q: How do I Invite Memebers?" value="about-item-7">
                        A: Under the group info section of your profile page, click "Manage Group" then click "Add Member Link". A link will be copied to your clipboard which you must send in to the invitee. We recommend sending the link via email.
                    </ExpanderItem>
                    <ExpanderItem title="Q: How do I accept an Invitation?" value="about-item-8">
                        A: You will receive an email with a hyperlink to the group's signup page. You will be prompted to signup or login and subsequently prompted to enter your position/title before joining the group.
                    </ExpanderItem>
                    <ExpanderItem title="Q: Where is my invitation email?" value="about-item-9">
                        A: If a group leader has claimed they have sent an invitation email, make sure to check your spam folder and refresh your inbox. Request another invitation be sent if the issue persists.
                    </ExpanderItem>
                    </ExpanderItem>
                    <ExpanderItem title="Groups" value="about-item-2">
                    <ExpanderItem title="Q: How do I Create a Group?" value="about-item-10">
                        A: Under the group info section of your profile page, click "Create Group" and follow the subuqent prompts.
                    </ExpanderItem>
                    <ExpanderItem title="Q: How do I Invite Memebers?" value="about-item-11">
                        A: Under the group info section of your profile page, click "Manage Group" then click "Add Member Link". A link will be copied to your clipboard which you must send in to the invitee. We recommend sending the link via email.
                    </ExpanderItem>
                    <ExpanderItem title="Q: How do I accept an Invitation?" value="about-item-12">
                        A: You will receive an email with a hyperlink to the group's signup page. You will be prompted to signup or login and subsequently prompted to enter your position/title before joining the group.
                    </ExpanderItem>
                    <ExpanderItem title="Q: Where is my invitation email?" value="about-item-13">
                        A: If a group leader has claimed they have sent an invitation email, make sure to check your spam folder and refresh your inbox. Request another invitation be sent if the issue persists.
                    </ExpanderItem>
                    </ExpanderItem>
                </Expander>
            </Flex>
        </div>
    );
}

export default FAQ