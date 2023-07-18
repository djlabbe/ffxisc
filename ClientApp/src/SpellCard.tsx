import { Card, CardBody, Center, Heading, Stack } from "@chakra-ui/react";
import BlueMagic from "./models/BlueMagic";
import { TraitSpell } from "./models/Trait";

interface Props {
  spell: BlueMagic | TraitSpell;
}

const SpellCard = ({ spell }: Props) => {
  return (
    <Card direction={"row"} variant={"outline"} width={"100%"} p={"1px"}>
      <Stack>
        <CardBody>
          <Center>
            <Heading size="xs">{spell.name}</Heading>
          </Center>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default SpellCard;
