import React from 'react'
import { Button, Input, FormControl, FormLabel, Divider, Select, Stack, Box } from '@chakra-ui/react';



class ResourceParametersForRoles extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        id: "",
        numberOfInstances: "",
        schedule: "",
        timeTables: props.getData("currentScenario").resourceParameters.timeTables.map(item => item.id)
      };

      this.onSubmit = this.onSubmit.bind(this);
  
    }



    componentDidMount(){

      if(this.props.getData("currentScenario").resourceParameters.roles.find((value) => value.id === this.props.currentRole)){
        this.setState({
            numberOfInstances: this.props.getData("currentScenario").resourceParameters.roles.find((value) => value.id === this.props.currentRole).numberOfInstances,
            schedule: this.props.getData("currentScenario").resourceParameters.roles.find((value) => value.id === this.props.currentRole).schedule,
            id: this.props.getData("currentScenario").resourceParameters.roles.find((value) => value.id === this.props.currentRole).id
          
          })
      }
    }


    handleInputChange(resource) {
        const target = resource.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
  
        //this.props.getData("currentScenario").resourceParameters.roles.find((value) => value.id === this.props.currentRole)[name] = target.value
      
      }

      onSubmit(event){
        event.preventDefault();

        console.log(this.props)
        
        let data = [... this.props.getData("allScenario")]

        console.log(data)
  
       
        data[this.props.currentScenario].resourceParameters.roles.find((value) => value.id === this.props.currentRole).numberOfInstances = this.state.numberOfInstances
        data[this.props.currentScenario].resourceParameters.roles.find((value) => value.id === this.props.currentRole).schedule = this.state.schedule                                                              
        data[this.props.currentScenario].resourceParameters.roles.find((value) => value.id === this.props.currentRole).id = this.state.id                                                                                                 
    

        this.props.setData(data)
        console.log(data[this.props.currentScenario])
      
      }



render() {


    return (
        <>
        
        <Button onClick={() => this.props.setCurrent("Add Resource")}
                colorScheme='#ECF4F4'
                variant='outline'
                w="100%"
                border='1px'
                borderColor='#B4C7C9'
                color ='#6E6E6F'
                _hover={{ bg: '#B4C7C9' }}> Add resource </Button> 

        <Button onClick={() => this.props.setCurrent("Add Role")}
               colorScheme='#ECF4F4'
                variant='outline'
                w="100%"
                border='1px'
                borderColor='#B4C7C9'
                color ='#6E6E6F'
                _hover={{ bg: '#B4C7C9' }}> Add role </Button> 

        <Divider/>
        <Box w="100%">
        <form onSubmit={this.onSubmit}>
        <Stack gap="2" mt="4">
         <FormControl >
              <FormLabel>Role Name:</FormLabel>
              <Input value={this.state.id} bg="white" name = "id" onChange={(event) => this.handleInputChange(event)} />
          </FormControl>

          <FormControl >
              <FormLabel>Number of Instances:</FormLabel>
              <Input value={this.state.numberOfInstances} bg="white" name = "numberOfInstances" onChange={(event) => this.handleInputChange(event)}  />
          </FormControl>



          <FormControl >
              <FormLabel>Timetable:</FormLabel>
              <Select value={this.state.schedule} bg="white" name="schedule" onChange={(event) => this.handleInputChange(event)} >
                {this.state.timeTables.map((id, index) => {
                    return <option value={id} key={index}>{id}</option>
                })}
            </Select>
         </FormControl>

          <Button 
              type="submit"
              colorScheme='#ECF4F4'
              w="100%"
              variant='outline'
              border='1px'
              borderColor='#B4C7C9'
              color ='#6E6E6F'
              _hover={{ bg: '#B4C7C9' }}> Save changes </Button> 
        </Stack>
        </form>
        </Box>
        </>
    )
}
}
export default ResourceParametersForRoles;