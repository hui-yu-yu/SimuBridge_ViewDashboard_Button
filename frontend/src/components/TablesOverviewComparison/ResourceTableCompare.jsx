import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Popover,
    PopoverTrigger,
    Button,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
} from '@chakra-ui/react'


//TODO refactor to new popover and diff mechanics
function ResourceTableCompare(props) {
    //**POPOVER is a little windows which opens on click of Parameters which are different for the scenario on COmparison page

    /// /*this method checks if pop over window is needed.
    //      comparison logic: if Simulation Scenario  Parameter differ at any of compared scenarios it is added to scenDiff
    //      Here method incoming parameter is field_id. If this field_id is in the scenDiff, that means that this parameter
    //      (field_id) is different in some compared scenarios. That means that we need a window which shows this parameter value
    //      in all compared scenarios*/
    const isPopover = (field_id) => {
        if (props.scenDiff.includes(field_id)) {
            return true
        } else return false
    };

    // Method finds role for the resource in current scenario
    let role
    const getRole = (resource_id) => {
        for (let role of props.getData().getCurrentScenario().resourceParameters.roles) {
            for (let resource of role.resources) {
                if (resource.id === resource_id) {
                    return role = role.id;
                } else role = "Unassigned"
            }
        }
        return role
    }
    let return_text, currency, x

    //Filling in Role in Pop over window in other compared scenarios (if role differ for the specific resource)
    const fillRole = (resource_id, role_id) => {
        return props.getData().getAllScenarios().map((element) => {
            if (props.scenariosCompare.includes(element.scenarioName) === true) {
                let role = element.resourceParameters.roles.find(item => item.id === role_id)
                if (role !== undefined) {
                    for (let resource of role.resources) {
                        if (resource.id === resource_id) {
                            // Resource exists, but no at the same role as in current Scenario. Role exists too
                            return return_text = element.scenarioName + ": The Role exist in " + role.id + "."
                        }
                    }
                    for (let dep of element.resourceParameters.roles) {
                        for (let res of dep.resources) {
                            if (res.id === resource_id) {
                                // Resource exists in different role as in current scenario
                                return return_text = element.scenarioName + ": The Role exist in" + dep.id + "."
                            }
                            // Resource does not exist neither in role nor in scenario, but role exist in the the scenario
                            else return_text = element.scenarioName + ": The Role does not exist in the scenario."
                        }

                    }

                } else {
                    for (let dep of element.resourceParameters.roles) {
                        for (let resource of dep.resources) {
                            if (resource.id === resource_id) {
                                // resource(same as in current scenario) does not exist
                                return return_text = element.scenarioName + ": The Resource exist in" + dep.id + "."
                            }
                            // both resource and role do not esist in the scenario
                            else return_text = element.scenarioName + ": The Resource and the Role do not exist in the scenario."
                        }
                        // return return_text
                    }
                    // return <div><Text>{return_text}</Text></div>
                }
                return <div>{return_text}</div>
            }
        })
    }

    // method to check do we need popover window (if any of resource parameters are  in ResourceCompared, meaning that they differ from current scenario)
    const isDifferentPopover = (field_id, id, value) => {
        let isDifferent = false
        props.ResourceCompared.map((role) => {
            if (field_id === role.field && id === role.id && value === role.value) {
                return isDifferent = true
            }
        })
        return isDifferent
    };

// Fill in role Pop over window
    const resPopover = (resource) => {
        return props.getData().getAllScenarios().map((element) => {
            if (props.scenariosCompare.includes(element.scenarioName) === true) {
                let res = element.resourceParameters.resources.find(item => item.id === resource)
                if (res !== undefined) {
                    return <Text fontWeight='semibold'>{element.scenarioName}: <Text fontWeight='normal'> {resource}</Text></Text>
                }
                return <Text>{element.scenarioName}: this role is not defined</Text>
            }
        })
    }

    // Fill in timatable popover window
    const timetablePopover = (resource) => {
        return props.getData().getAllScenarios().map((element) => {
            if (props.scenariosCompare.includes(element.scenarioName) === true) {
                let res = element.resourceParameters.resources.find(item => item.id === resource)
                if (res !== undefined) {
                    return <div>{element.scenarioName}: {res.schedule}</div>
                }
                return <Text>{element.scenarioName}: this role is not defined</Text>
            }
        })
    }

    let res = []
// Fill in cost popover window
    const costsPopover = (resource) => {
        return props.getData().getAllScenarios().map((element) => {
            if (props.scenariosCompare.includes(element.scenarioName) === true) {
                res = element.resourceParameters.resources.find(item => item.id === resource)
                if (res !== undefined) {
                    return <> <Text fontWeight='semibold'>{element.scenarioName}: </Text>
                        <Text> {res.id}: {res.costHour} </Text>
                    </>
                } else return <Text fontWeight='semibold'>{element.scenarioName}:<Text fontWeight='normal'> Resource is
                    not defined</Text></Text>
            }
        })
    }

    return (
        <>
            <Table variant='simple'>
                <Thead w="100%">
                    <Tr>
                        <Th>Role</Th>
                        <Th>Resource</Th>
                        <Th>Quantity</Th>
                        <Th>Costs</Th>
                        <Th>Currency</Th>
                        <Th>Timetable</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.getData().getCurrentScenario().resourceParameters.resources.map((resource) => {
                        return <Tr>
                            {/*Role*/}
                            <Td>
                                {/*if isDifferentPopover returns false, we just display Role of the Resource ,
                        as it is the same among all compared scenarios. If isDifferentPopover returns true we create a button.
                        Text of this button is value of the Role(role) parameter of current scenario.
                         If user clicks on button it works like a trigger, and shows values of Role of the Resource of all compared scenarios
                         The same logic is applied for all Resource parameters
                  */}
                                {!isDifferentPopover("role", resource.id, getRole(resource.id)) ?
                                    <Text>{getRole(resource.id)}</Text>
                                    :
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button>  {getRole(resource.id)}</Button>
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent bg='#dce5e6' zIndex={4}>
                                                <PopoverArrow/>
                                                <PopoverCloseButton/>
                                                <PopoverBody>
                                                    {fillRole(resource.id, getRole(resource.id))}
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>

                                }
                            </Td>
                            <Td>
                                {!isDifferentPopover("id", resource.id, resource.id) ?
                                    <Text> {resource.id} </Text>
                                    :
                                    <>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button> {resource.id}</Button>
                                            </PopoverTrigger>
                                            <Portal>
                                                <PopoverContent bg='#dce5e6'>
                                                    <PopoverArrow/>
                                                    <PopoverCloseButton/>
                                                    <PopoverBody>
                                                        {resPopover(resource.id)}
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Portal>
                                        </Popover>
                                    </>
                                }
                            </Td>
                            {/*Costs*/}
                            <Td>
                                {isDifferentPopover("costHour", resource.id, resource.costHour) === false ?
                                    <Text> {resource.costHour} </Text>
                                    :
                                    <>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button>
                                                    {resource.costHour}
                                                </Button>
                                            </PopoverTrigger>
                                            <Portal>
                                                <PopoverContent bg='#dce5e6'>
                                                    <PopoverArrow/>
                                                    <PopoverCloseButton/>
                                                    <PopoverBody>
                                                        {costsPopover(resource.id)}
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Portal>
                                        </Popover>
                                    </>
                                }
                            </Td>
                            {/*Currency*/}
                            <Td>
                                {isPopover("currency") === false ?
                                    <Text> {props.getData().getCurrentScenario().currency} </Text>
                                    :
                                    <>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button> {props.getData().getCurrentScenario().currency}
                                                </Button>
                                            </PopoverTrigger>
                                            <Portal>
                                                <PopoverContent bg='#dce5e6'>
                                                    <PopoverArrow/>
                                                    <PopoverCloseButton/>
                                                    <PopoverBody>
                                                        {props.getData().getAllScenarios().map((element) => {
                                                            {
                                                                currency = null
                                                                props.scenariosCompare.includes(element.scenarioName) === true ?
                                                                    currency = element.scenarioName + ":" + " " + element.currency
                                                                    : currency = null
                                                            }
                                                            return <div>{currency}</div>
                                                        })}
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Portal>
                                        </Popover>
                                    </>
                                }
                            </Td>
                            {/*Timetable*/}
                            <Td>
                                {isDifferentPopover("schedule", resource.id, resource.schedule) === false ?
                                    <Text> {resource.schedule}</Text>
                                    :
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button> {resource.schedule}</Button>
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent bg='#dce5e6'>
                                                <PopoverArrow/>
                                                <PopoverCloseButton/>
                                                <PopoverBody>
                                                    {timetablePopover(resource.id)}
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>
                                }
                            </Td>


                        </Tr>
                    })}

                </Tbody>
            </Table>
        </>
    )
}

export default ResourceTableCompare


