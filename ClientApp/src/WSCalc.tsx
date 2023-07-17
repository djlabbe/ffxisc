import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { calcWSDamage } from "./calculations/weaponskill";
import { Text } from "@chakra-ui/react";

interface WeaponSkillParams {
  weaponBaseDamage: string;
  str: string;
  vit: string;
  wpnMod1: string;
  wpnStat1: string;
  wpnMod2: string;
  wpnStat2: string;
  ftp: string;
  attack: string;
  defense: string;
  wpnNumHits: string;
  pdlTrait: string;
  pdlGear: string;
  wsd: string;
  wsBonus: string; // Bonus damage multiplier to every hit on the WS. Stuff like Gokotai, Naegling, hidden Relic/Mythic WS damage, REMA augments.
  wsTrait: string; // Only DRG traits go here. DRG main job also gets wyvern bonus 10% here.
  critRate: string;
  critDamageBonus: string;
}

const WSCalc = () => {
  const [weaponSkillParams, setWeaponSkillParams] = useState<WeaponSkillParams>(
    {
      weaponBaseDamage: "",
      str: "",
      vit: "",
      wpnMod1: "",
      wpnStat1: "",
      wpnMod2: "",
      wpnStat2: "",
      ftp: "",
      attack: "",
      defense: "",
      wpnNumHits: "",
      pdlTrait: "",
      pdlGear: "",
      wsd: "",
      wsBonus: "",
      wsTrait: "",
      critRate: "",
      critDamageBonus: "",
    }
  );
  const [lastSwing, setLastSwing] = useState<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeaponSkillParams({
      ...weaponSkillParams,
      [e.target.name]: value,
    });
  };

  const handleSwing = () => {
    const damage = calcWSDamage(
      "Great Katana",
      Number(weaponSkillParams.attack),
      Number(weaponSkillParams.defense),
      Number(weaponSkillParams.wpnNumHits),
      false,
      Number(weaponSkillParams.weaponBaseDamage),
      Number(weaponSkillParams.str),
      Number(weaponSkillParams.vit),
      Number(weaponSkillParams.wpnMod1) * Number(weaponSkillParams.wpnStat1) +
        Number(weaponSkillParams.wpnMod2) * Number(weaponSkillParams.wpnStat2),
      Number(weaponSkillParams.ftp),
      Number(weaponSkillParams.critRate),
      Number(weaponSkillParams.critDamageBonus),
      Number(weaponSkillParams.wsd),
      Number(weaponSkillParams.wsBonus),
      Number(weaponSkillParams.wsTrait),
      Number(weaponSkillParams.pdlTrait),
      Number(weaponSkillParams.pdlGear)
    );
    setLastSwing(damage);
  };

  const renderInput = (label: string, name: keyof WeaponSkillParams, placeholder?: string) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          name={name}
          value={weaponSkillParams[name]}
        />
      </FormControl>
    );
  };

  return (
    <>
      <Box my="2">
        <Heading>Weapon Skill Damage Calculator</Heading>
      </Box>
      <Grid my="5" templateColumns='repeat(2, 1fr)' gap={6}>
        {renderInput("Weapon Base Damage", "weaponBaseDamage", "Damage as displayed on Weapon")}
        {renderInput("Player STR", "str")}
        {renderInput("Enemy VIT", "vit")}
        {renderInput("Weapon Mod A", "wpnMod1", "First WS Modifier % (0.00 - 1.00) [eg. Savage Blade = '0.5']")}
        {renderInput("Weapon Stat A", "wpnStat1", "First WS Modifier Value [eg. Savage Blade = Player STR]")}
        {renderInput("Weapon Mod B", "wpnMod2", "Second WS Modifier % (0.00 - 1.00) [eg. Savage Blade = '0.5']")}
        {renderInput("Weapon Stat B", "wpnStat2", "Second WS Modifier Value [eg. Savage Blade = Player MND]")}
        {renderInput("fTP", "ftp", "FTP Value [eg. Savage Blade 1000 TP = '4.0']")}
        {renderInput("Player Attack", "attack")}
        {renderInput("Enemy Defense", "defense")}
        {renderInput("Number of WS Hits", "wpnNumHits", "Number of hits [eg. Savage Blade = '2']")}
        {renderInput("PDL Trait", "pdlTrait", "PDL from Traits [eg. '0.3']")}
        {renderInput("PDL Gear/Song", "pdlGear", "PDL from Gear and Songs [eg. '0.45']")}
        {renderInput("Weapon Skill Damage", "wsd", "Weapon Skill Damage from gear [eg. '0.8']")}
        {renderInput("Weapon Skill Bonus", "wsBonus", "Stuff like Gokotai, Naegling, hidden Relic/Mythic WS damage, REMA augments [eg. '0.8']")}
        {renderInput("Weapon Skill Trait", "wsTrait", "DRG or /DRG traits. Add 0.1 for Wyvern as DRG [eg. '0.4']")}
        {renderInput("Critical Rate", "critRate", "% chance to crit [eg. '0.05']")}
        {renderInput("Critical Damage Bonus", "critDamageBonus", "Any Critical Damage Bonus from gear [eg. '0.1']")}
      </Grid>
      <Button onClick={handleSwing}>Swing!</Button>
      {lastSwing != undefined && (
        <Text>You weaponskill for {Math.round(lastSwing)} damage!</Text>
      )}
    </>
  );
};

export default WSCalc;
