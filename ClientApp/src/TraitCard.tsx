import {
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
} from "@chakra-ui/react";
import Trait from "./models/Trait";
import SpellCard from "./SpellCard";

interface Props {
  trait: Trait;
}

const TraitCard = ({ trait }: Props) => {
  return (
    <Card direction={"row"} variant={"outline"} width={"100%"} p={"1px"}>
      <Stack>
        <CardBody>
          <Heading size="md">{trait.name}</Heading>
          <HStack>
            {trait.spells.map(spell => (
              <SpellCard key={spell.name} spell={spell} />
            ))}
          </HStack>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default TraitCard;
