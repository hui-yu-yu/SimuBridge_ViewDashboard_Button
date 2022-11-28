import {React, useState, useEffect} from 'react';
import './styles/globals.css'
import {
  ChakraProvider,
  Box,
  theme,
  Flex,
  Container
} from '@chakra-ui/react';
import Navigation from './components/Navigation/Navigation';
import Parameditor from './components/Parameditor';
import StartView from './components/StartView';
import BpmnViewSelector from './components/Background/BpmnViewSelector';
import ResourcePage from './components/Pages/ResourcePage';
import ScenarioPage from './components/Pages/ScenarioPage';
import BpmnModelParser from './BpmnModelParser';
import axios from "axios";
import { Redirect, Router } from "@reach/router"


function App() {
  const [current, setCurrent] = useState("Scenario Parameters")

  const [projectStarted, setStarted] = useState(sessionStorage.getItem('st') || "false")
  const [bpmns, setBpmns] = useState([{
                                        name: "Warenversand",
                                        file : "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/01-Vorbereitung-des-Warenversands/03-Musterl%C3%B6sung/vorbereitung-des-warenversands.bpmn" 
                                      },
                                      {
                                        name: "Schufascoring",
                                        file : "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/03-Schufascoring/03-Musterl%C3%B6sung/schufascoring-asynchron.bpmn"
                                      },
                                      {
                                        name: "Selbstbedienung",
                                        file : "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/04-Selbstbedienungsrestaurant/03-Musterl%C3%B6sung/selbstbedienungsrestaurant.bpmn"
                                      }])
  const [scenarios, setscenarios] = useState([{
                                        name: "Scenario 1",
                                      },
                                      {
                                        name: "Scenario 2",
                                      }])
                                      
  const [currentBpmn, setBpmn] = useState(0)
  const [currentScenario, setScenario] = useState(0)
  const [currentObject, setObject] = useState({})

  const [data, setData] = useState(
    [
      { 
        scenarioName: "Scenario 1",
        startingDate: "14-11-2022",
        startingTieme: "12:00",
        numberOfInstances: 2,
        scenario: {
          "models": [{
                  "BPMN": "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/01-Vorbereitung-des-Warenversands/03-Musterl%C3%B6sung/vorbereitung-des-warenversands.bpmn",
                  "name": "Warenversand",
                  "parameters": {
                      "simulation": {
                          "startingTime": "12:00",
                          "StartingDate": "22-11-2022",
                          "instanceNumber": 2
                      },
                      "resource": [{
                          "role": "Top Management",
                          "resources": [{
                              "name": "Management Board",
                              "schedules": "40h",
                              "costHour": 20
                          }]
                      }],
                      "modelParameter": null,
                      
                      "roles": [{
                              "name": "Management Board",
                              "parent": 0
                          },
                          {
                              "name": "Management Directory",
                              "parent": 1
                          }
                      ]
                  }
              },
              {
                "BPMN": "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/03-Schufascoring/03-Musterl%C3%B6sung/schufascoring-asynchron.bpmn",
                "name": "Schufascoring",
                "parameters": {
                    "simulation": {
                        "startingTime": "12:00",
                        "StartingDate": "22-11-2022",
                        "instanceNumber": 2
                    },
                    "resource": [{
                        "role": "Top Management",
                        "resources": [{
                            "name": "Management Board",
                            "schedules": "40h",
                            "costHour": 20
                        }]
                    }],
                    "modelParameter": null,
                    
                    "roles": [{
                            "name": "Management Board",
                            "parent": 0
                        },
                        {
                            "name": "Management Directory",
                            "parent": 1
                        }
                    ]
                }
            }
          ]
        }
      
    },
    {
      scenarioName: "Scenario 2",
      startingDate: "14-11-2022",
      startingTieme: "12:00",
      numberOfInstances: 2,
      scenario: {
        "models": [{
                "BPMN": "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/01-Vorbereitung-des-Warenversands/03-Musterl%C3%B6sung/vorbereitung-des-warenversands.bpmn",
                "name": "Warenversand",
                "parameters": {
                    "simulation": {
                        "startingTime": "12:00",
                        "StartingDate": "22-11-2022",
                        "instanceNumber": 2
                    },
                    "resource": [{
                        "role": "Top Management",
                        "resources": [{
                            "name": "Management Board",
                            "schedules": "40h",
                            "costHour": 20
                        }]
                    }],
                    "modelParameter": null,
                    
                    "roles": [{
                            "name": "Management Board",
                            "parent": 0
                        },
                        {
                            "name": "Management Directory",
                            "parent": 1
                        }
                    ]
                }
            },
            {
              "BPMN": "https://raw.githubusercontent.com/camunda/bpmn-for-research/master/BPMN%20for%20Research/German/03-Schufascoring/03-Musterl%C3%B6sung/schufascoring-asynchron.bpmn",
              "name": "Schufascoring",
              "parameters": {
                  "simulation": {
                      "startingTime": "12:00",
                      "StartingDate": "22-11-2022",
                      "instanceNumber": 2
                  },
                  "resource": [{
                      "role": "Top Management",
                      "resources": [{
                          "name": "Management Board",
                          "schedules": "40h",
                          "costHour": 20
                      }]
                  }],
                  "modelParameter": null,
                  
                  "roles": [{
                          "name": "Management Board",
                          "parent": 0
                      },
                      {
                          "name": "Management Directory",
                          "parent": 1
                      }
                  ]
              }
          }
        ]
      }
    
  }
  ]
)
  

  useEffect(() => {
    sessionStorage.setItem('st', projectStarted);
  }, [projectStarted]);

  
  useEffect(() => {
    console.log(data)
  }, [data])
  

  useEffect(() => {
    console.log(currentObject)
  }, [currentObject])


  useEffect( () => {
    if(data[0]){
      data.forEach((scen, indexscen) => {
        
        scen.scenario.models.forEach((element, indexmodel) =>{
          axios
          .get(
            data[indexscen].scenario.models[indexmodel].BPMN
          )
          .then(async (r) => {
            var x = data[indexscen].scenario.models[indexmodel]
              x.parameters.modelParameter = await BpmnModelParser(r.data)
            
            })
          .catch((err) => {
              console.log("error", err);
          });
        })
      })
    }
  }, [data])

 const getData = (type) => {
  switch (type) {
    case "currentScenario": return data[currentScenario]
    case "allScenarios": return data
    case "currentModel": return data[currentScenario].scenario.models[currentBpmn]
    case "allModels": return data[currentScenario].scenario
    default:
      return data
  }
 }

 const setDataObj = (type, data) =>{
  switch (type) {
    case "activity": setData(data[currentScenario].scenario.models[currentBpmn].parameters.modelParameter.activities = data)
    default:
      break;
  }
 }



  return (
    <ChakraProvider theme={theme}>
      {/*<BpmnParser currentBpmn={currentBpmn} bpmns={bpmns} data={data} setData={setData} /> */}

      <Flex bg="#F9FAFC" h="100vh" zIndex={-3}>
        {projectStarted === "false"?
          <StartView setStarted={setStarted}/>
        :
        <>
          <Box zIndex={2} paddingTop={{base: "0", md:"6"}} >
            <Navigation 
              setCurrent={setCurrent}  
              current={current} 
              setStarted={setStarted} 
              bpmns={bpmns} 
              currentBpmn={currentBpmn} 
              setBpmn={setBpmn} 
              currentScenario={currentScenario}
              data={data} 
              setScenario={setScenario}
              scenarios={scenarios}
              />
            <Parameditor setDataObj={setDataObj} setData={setData} getData={getData} current={current} currentBpmn={currentBpmn} selectedObject={currentObject}  currentScenario={currentScenario} />
          </Box>

        
          <Container maxW={current === "Modelbased Parameters"? '' : '60vw'}>
            
          
            <Router>
               <Redirect exact from="/" to="/scenario" />
                <ScenarioPage path="/scenario" setCurrent={setCurrent} current={current} setObject={setObject} currentBpmn={currentBpmn}  bpmns={bpmns} data={data} currentScenario={currentScenario} />
                <BpmnViewSelector path="/modelbased" zIndex={-5} setCurrent={setCurrent}  current={current} setObject={setObject} currentBpmn={currentBpmn}  bpmns={bpmns} data={data} currentScenario={currentScenario} />
                <ResourcePage path="/resource" current={current} setCurrent={setCurrent}  setObject={setObject} currentBpmn={currentBpmn}  bpmns={bpmns} data={data} currentScenario={currentScenario} />
            </Router>
          
              {/*<Page current={current} setObject={setObject} currentBpmn={currentBpmn}  bpmns={bpmns} data={data} currentScenario={currentScenario} />*/}
            
         </Container>
        
        </>
        }
      </Flex>
    </ChakraProvider>
  );
}

export default App;
