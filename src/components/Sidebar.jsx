import React, {  useState } from 'react'
import {
    Flex,
    Text,
    Divider,
    IconButton
    
  } from '@chakra-ui/react'

  import { FiMenu } from 'react-icons/fi';



function Sidebar(props) {
    const [hidden, setHidden] = useState(false)

  return (
        <Flex
            boxShadow='sm' 
            backgroundColor={props.backgroundColor}
            alignItems={hidden ? "center" : "baseline"}
            flexDir="column"
            gap={{base: "3", md:"5"}}
            width={hidden ? "" :{
              sm: '220px', 
              md: '300px'
            }}
            p={hidden ? "" :[
              '3', 
              '3',
              '6', 
              '6', 
            ]}
            paddingRight={hidden ? "" :{
              sm: "7 !important",
              md: "10 !important"
            }}

            position="absolute"
            h={hidden ? "" : {base: "100vh", md:"95vh"}}
            rounded={hidden ? "xl" : {base: "none", md:"2xl"}}
            left={props.side === "left" ? {base: "0vh", md:"2vh"} : ""}
            right={props.side === "right" ? {base: "0vh", md:"2vh"} : ""}
        >
        <Flex alignItems="center" >
          
            <IconButton  left={hidden ? "2" : ""} onClick={() => setHidden(!hidden)} icon={<FiMenu />} fontSize="19" variant="unstyled" />
              {!hidden? props.title : ""}
        </Flex>
      
        <Divider display={hidden ? "none" : "block"}/>


        {!hidden? props.content : ""}

        

        </Flex>   
    
  )
}

export default Sidebar;