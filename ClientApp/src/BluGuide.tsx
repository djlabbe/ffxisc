import { useEffect, useState } from "react";
import BlueMagic from "./models/BlueMagic";
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import SpellCard from "./SpellCard";
import Trait from "./models/Trait";
import TraitCard from "./TraitCard";

const BluGuide = () => {
  const [spells, setSpells] = useState<BlueMagic[]>();
  const [traits, setTraits] = useState<Trait[]>();

  useEffect(() => {
    const getSpells = async () => {
      const res = await fetch("/src/assets/spellinfo.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const spells = (await res.json()) as BlueMagic[];
      const sorted = spells.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      setSpells(sorted);
    };

    const getTraits = async () => {
      const res = await fetch("/src/assets/traits.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const spells = (await res.json()) as Trait[];
      const sorted = spells.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      setTraits(sorted);
    };

    getSpells();
    getTraits();
  }, []);

  return (
    <Stack textAlign={"center"}>
      <Box>
        <Heading>Blue Mage Spell Calculator</Heading>
      </Box>
      <Flex minWidth="max-content" border={"1px"}>
        <Box w="300px" bg="gray.300" padding={5}>
          <Heading>My Spells</Heading>
        </Box>
        <Box flex={1} padding={5}>
          <Tabs position="relative" variant="unstyled" isFitted>
            <TabList>
              <Tab>Traits</Tab>
              <Tab>Utility</Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="blue.500"
              borderRadius="1px"
            />
            <TabPanels>
              <TabPanel>
                <VStack>
                  {traits?.map((trait) => (
                    <TraitCard key={trait.name} trait={trait} />
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack>
                  {spells?.map((spell) => (
                    <SpellCard key={spell.name} spell={spell} />
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Stack>
  );
};

export default BluGuide;
