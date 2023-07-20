import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import { calcWSDamage, weaponTypes } from "./calculations/weaponskill";
import { Text } from "@chakra-ui/react";
import { WeaponSkillParams, isWeaponType } from "./models/WeaponSkillParams";
import { WeaponSkill } from "./models/WeaponSkill";

const initialParams: WeaponSkillParams = {
  weaponType: "Hand-to-Hand",
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
  tp: "",
};

const WSCalc = () => {
  const [weaponSkillParams, setWeaponSkillParams] =
    useState<WeaponSkillParams>(initialParams);
  const [ftpReplicating, setFtpReplicating] = useState(false);
  const [lastSwing, setLastSwing] = useState<number[]>();
  const intTester = useMemo(() => new RegExp("^[0-9]+$"), []);
  const floatTester = useMemo(
    () => new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"),
    []
  );

  const [weaponskills, setWeaponskills] = useState<WeaponSkill[]>();
  const [selectedWS, setSelectedWS] = useState<WeaponSkill>();

  // Return between x and y, based on percentage a
  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  useEffect(() => {
    const getWeaponskills = async () => {
      const res = await fetch("/src/assets/weaponskills_final.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = (await res.json()) as WeaponSkill[];
      setWeaponskills(data);
    };

    getWeaponskills();
  }, []);

  useEffect(() => {
    if (!selectedWS) {
      setWeaponSkillParams({
        ...weaponSkillParams,
        weaponType: "Hand-to-Hand",
      });
    } else {
      setWeaponSkillParams({
        ...weaponSkillParams,
        weaponType: selectedWS.skill || "Hand-to-Hand",
        wpnMod1: selectedWS.modifiers[0].value.toString(),
        wpnMod2:
          selectedWS.modifiers.length > 1
            ? selectedWS.modifiers[1].value.toString()
            : "",
        wpnNumHits: selectedWS.hits.toString(),
      });

      setFtpReplicating(selectedWS.ftpReplicating);
    }
  }, [selectedWS]);

  const handleIntegerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || intTester.test(e.target.value)) {
      if (e.target.name === "tp") {
        if (!selectedWS) return;
        let tp = Number(e.target.value);
        if (tp > 3000) tp = 3000;
        let ftp = 0;
        if (tp < 1000) ftp = 0;
        else if (tp >= 1000 && tp < 2000)
          ftp = lerp(selectedWS.ftp[0], selectedWS.ftp[1], (tp - 1000) / 1000);
        else
          ftp = lerp(selectedWS.ftp[1], selectedWS.ftp[2], (tp - 2000) / 1000);

        setWeaponSkillParams({
          ...weaponSkillParams,
          tp: e.target.value,
          ftp: ftp.toString(),
        });
      } else {
        setWeaponSkillParams({
          ...weaponSkillParams,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleFloatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "" || floatTester.test(e.target.value)) {
      setWeaponSkillParams({
        ...weaponSkillParams,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleWeaponTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isWeaponType(e.target.value)) {
      setWeaponSkillParams({
        ...weaponSkillParams,
        weaponType: e.target.value,
      });
    }
  };

  const handleWeaponSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wsName = e.target.value;
    const ws = weaponskills?.find((ws) => ws.name === wsName);
    setSelectedWS(ws);
  };

  const handleSwing = (count: number) => {
    
    const results = [];

    for (let i=0; i < count; i++){
        const wscA =
        Number(weaponSkillParams.wpnMod1) * Number(weaponSkillParams.wpnStat1);
      const wscB =
        Number(weaponSkillParams.wpnMod2) * Number(weaponSkillParams.wpnStat2);
      const wsc = wscA + wscB;

      const damage = calcWSDamage(
        weaponSkillParams.weaponType,
        Number(weaponSkillParams.attack),
        Number(weaponSkillParams.defense),
        Number(weaponSkillParams.wpnNumHits),
        false,
        Number(weaponSkillParams.weaponBaseDamage),
        Number(weaponSkillParams.str),
        Number(weaponSkillParams.vit),
        wsc,
        Number(weaponSkillParams.ftp),
        ftpReplicating,
        Number(weaponSkillParams.critRate),
        Number(weaponSkillParams.critDamageBonus),
        Number(weaponSkillParams.wsd),
        Number(weaponSkillParams.wsBonus),
        Number(weaponSkillParams.wsTrait),
        Number(weaponSkillParams.pdlTrait),
        Number(weaponSkillParams.pdlGear)
      );
      results.push(damage);
    }

    setLastSwing(results);
   
  };

  return (
    <div>
      <Box my="2">
        <Heading>Weapon Skill Damage Calculator</Heading>
      </Box>
      <Box my="5">
        {weaponskills && (
          <FormControl>
            <FormLabel>Select Weaponskill</FormLabel>
            <Select value={selectedWS?.name} onChange={handleWeaponSkillChange}>
              <option value={undefined}>Custom</option>
              {weaponskills.map((ws) => (
                <option key={ws.name} value={ws.name}>
                  {ws.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Heading as="h6" size="md">
        Player Stats
      </Heading>
      <Grid my="5" templateColumns="repeat(2, 1fr)" gap={2}>
        <FormControl>
          <FormLabel>Weapon Type</FormLabel>
          <FormHelperText>Determines base pDIF limits</FormHelperText>
          <Select
            value={weaponSkillParams.weaponType}
            onChange={handleWeaponTypeChange}
            disabled={!!selectedWS}
          >
            {weaponTypes.map((weapon) => (
              <option key={weapon} value={weapon}>
                {weapon}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Weapon Base Damage</FormLabel>
          <FormHelperText>Damage as displayed on weapon</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="weaponBaseDamage"
            value={weaponSkillParams.weaponBaseDamage}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Player STR</FormLabel>
          <FormHelperText>Player's strength</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="str"
            value={weaponSkillParams.str}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Player Attack</FormLabel>
          <FormHelperText>Raw attack value</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="attack"
            value={weaponSkillParams.attack}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Weapon Mod A</FormLabel>
          <FormHelperText>
            First WS Modifier % [eg. Savage Blade = '0.5']
          </FormHelperText>
          <Input
            onChange={handleFloatInputChange}
            name="wpnMod1"
            value={weaponSkillParams.wpnMod1}
            disabled={!!selectedWS}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Weapon Stat A</FormLabel>
          <FormHelperText>
            First WS Modifier Value [eg. Savage Blade = Player STR]
          </FormHelperText>
          <Input
            onChange={handleFloatInputChange}
            name="wpnStat1"
            value={weaponSkillParams.wpnStat1}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Weapon Mod B</FormLabel>
          <FormHelperText>
            Second WS Modifier % [eg. Savage Blade = '0.5']
          </FormHelperText>
          <Input
            onChange={handleFloatInputChange}
            name="wpnMod2"
            value={weaponSkillParams.wpnMod2}
            disabled={!!selectedWS}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Weapon Stat B</FormLabel>
          <FormHelperText>
            Second WS Modifier Value [eg. Savage Blade = Player MND]
          </FormHelperText>
          <Input
            onChange={handleFloatInputChange}
            name="wpnStat2"
            value={weaponSkillParams.wpnStat2}
            disabled={weaponSkillParams.wpnMod2 === ""}
          />
        </FormControl>

        {/* User enters actual TP if we know the WS, otherwise provides raw fTP value */}
        {selectedWS ? (
          <FormControl>
            <FormLabel>Player TP</FormLabel>
            <FormHelperText>
              fTP Breakpoints: [{selectedWS.ftp[0].toString()} ,
              {selectedWS.ftp[1].toString()}, {selectedWS.ftp[2].toString()}] |
              Current ftp: {weaponSkillParams.ftp || "0"}
            </FormHelperText>
            <Input
              placeholder="1000-3000"
              onChange={handleIntegerInputChange}
              name="tp"
              value={weaponSkillParams.tp}
            />
          </FormControl>
        ) : (
          <FormControl>
            <FormLabel>fTP</FormLabel>
            <FormHelperText>
              FTP Value [eg. Savage Blade 1000 TP = '4.0']
            </FormHelperText>
            <Input
              onChange={handleFloatInputChange}
              name="ftp"
              value={weaponSkillParams.ftp}
              disabled={!!selectedWS}
            />
          </FormControl>
        )}

        <FormControl>
          <FormLabel>FTP Replicating</FormLabel>
          <FormHelperText>True or False</FormHelperText>
          <Checkbox
            size="lg"
            colorScheme="orange"
            checked={ftpReplicating}
            disabled={!!selectedWS}
            onChange={(e) => setFtpReplicating(e.target.checked)}
          >
            FTP Replicating WS
          </Checkbox>
        </FormControl>

      

        <FormControl>
          <FormLabel>Number of Hits</FormLabel>
          <FormHelperText>How many swings in one WS</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="wpnNumHits"
            value={weaponSkillParams.wpnNumHits}
            disabled={!!selectedWS}
          />
        </FormControl>

        <FormControl>
          <FormLabel>PDL Trait</FormLabel>
          <FormHelperText>PDL from Traits</FormHelperText>
          <Input
            placeholder="0.00"
            onChange={handleFloatInputChange}
            name="pdlTrait"
            value={weaponSkillParams.pdlTrait}
          />
        </FormControl>

        <FormControl>
          <FormLabel>PDL Gear/Song</FormLabel>
          <FormHelperText>
            PDL from Gear and Songs
          </FormHelperText>
          <Input
            placeholder="0.00"
            onChange={handleFloatInputChange}
            name="pdlGear"
            value={weaponSkillParams.pdlGear}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Weapon Skill Damage</FormLabel>
          <FormHelperText>
            Weapon Skill Damage from gear
          </FormHelperText>
          <Input
            placeholder="0.00"
            onChange={handleFloatInputChange}
            name="wsd"
            value={weaponSkillParams.wsd}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Weapon Skill Bonus</FormLabel>
          <FormHelperText>
            WSD Bonus (Naegling property, hidden R/M WSD, REMA augs)
          </FormHelperText>
          <Input
            placeholder="0.00"
            onChange={handleFloatInputChange}
            name="wsBonus"
            value={weaponSkillParams.wsBonus}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Weapon Skill Trait</FormLabel>
          <FormHelperText>
            DRG or /DRG traits. Add 0.1 for Wyvern as DRG
          </FormHelperText>
          <Input
            placeholder="0.00 - 1.00"
            onChange={handleFloatInputChange}
            name="wsTrait"
            value={weaponSkillParams.wsTrait}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Critical Rate</FormLabel>
          <FormHelperText>Critical Chance</FormHelperText>
          <Input
            placeholder="0.00 - 1.00"
            onChange={handleFloatInputChange}
            name="critRate"
            value={weaponSkillParams.critRate}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Critical Bonus Damage</FormLabel>
          <FormHelperText>
            Critical Damage Bonus from gear
          </FormHelperText>
          <Input
            placeholder="0.00 - 1.00"
            onChange={handleFloatInputChange}
            name="critDamageBonus"
            value={weaponSkillParams.critDamageBonus}
          />
        </FormControl>
      </Grid>
      <Heading as="h6" size="md">
        Enemy Stats
      </Heading>
      <Grid my="5" templateColumns="repeat(2, 1fr)" gap={2}>
        <FormControl>
          <FormLabel>Enemy Defense</FormLabel>
          <FormHelperText>Target's defense</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="defense"
            value={weaponSkillParams.defense}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Enemy VIT</FormLabel>
          <FormHelperText>Target's vitality</FormHelperText>
          <Input
            onChange={handleIntegerInputChange}
            name="vit"
            value={weaponSkillParams.vit}
          />
        </FormControl>
      </Grid>
      <Button onClick={() => handleSwing(1)} me="5">
        Swing
      </Button>
      <Button onClick={() => handleSwing(5)} me="5">
        Swing 5x
      </Button>
      <Button onClick={() => handleSwing(10)}>Swing 10x</Button>
      <Box mt="5">
        {lastSwing != undefined && (
          lastSwing.map(n => <Text>You weaponskill for {Math.round(n)} damage!</Text>)
        )}
      </Box>
    </div>
  );
};

export default WSCalc;
