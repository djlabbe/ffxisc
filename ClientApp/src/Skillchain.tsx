import {
    Box,
    Button,
    Center,
    HStack,
    Heading,
    Select,
    VStack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const allJobs = [
    "Warrior",
    "Monk",
    "White Mage",
    "Black Mage",
    "Red Mage",
    "Thief",
    "Paladin",
    "Dark Knight",
    "Beastmaster",
    "Bard",
    "Ranger",
    "Summoner",
    "Samurai",
    "Ninja",
    "Dragoon",
    "Blue Mage",
    "Corsair",
    "Puppetmaster",
    "Dancer",
    "Scholar",
    "Geomancer",
    "Rune Fencer",
  ];
  
  const Skillchain = () => {
    const [jobs, setJobs] = useState<string[]>([""]);
  
    const handleJobChange = (index: number, value: string) => {
      const nextJobs = jobs.map((j, i) => {
        if (index === i) return value;
        return j;
      });
      setJobs(nextJobs);
    };
  
    const handleAddJob = () => {
      setJobs([...jobs, ""]);
    };
  
    // const handleRemoveJob = (index: number) => {
    //   const nextJobs = [
    //     ...jobs.slice(0, index),
    //     ...jobs.slice(index + 1, jobs.length),
    //   ];
    //   setJobs(nextJobs);
    // };
  
    return (
        <VStack>
          <Box>
            <Center>
              <Heading as="h1" noOfLines={1}>
                FFXI SC
              </Heading>
            </Center>
          </Box>
          <Box w="80%" borderWidth="1px" p="5">
            {jobs.map((job, i) => (
              <HStack>
                <Select
                  key={i}
                
                  size="lg"
                  my="2"
                  value={job}
                  onChange={(e) => handleJobChange(i, e.target.value)}
                >
                  {allJobs.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </Select>
                {i > 0 && (
                  <Button
                    colorScheme="red"
                    size="lg"
                    // onClick={(e) => handleRemoveJob(i)}
                  >
                    X
                  </Button>
                )}
              </HStack>
            ))}
  
            <Center>
              <Button colorScheme="green" onClick={handleAddJob}>
                Add Player
              </Button>
            </Center>
          </Box>
        </VStack>
    );
  }
  
  export default Skillchain;
  