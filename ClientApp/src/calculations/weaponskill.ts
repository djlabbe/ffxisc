export const calcWSDamage = (
  wpn_type_skill:
    | "Katana"
    | "Dagger"
    | "Sword"
    | "Axe"
    | "Club"
    | "Great Katana"
    | "Hand-to-Hand"
    | "Great Sword"
    | "Staff"
    | "Great Axe"
    | "Polearm"
    | "Scythe",
  playerAttack: number,
  enemyDefense: number,
  wsNumHits: number,
  dw: boolean,
  weaponBaseDamage: number,
  str: number,
  vit: number,
  wsc: number,
  fTP: number,
  critRate: number,
  critDamageBonus: number,
  wsd: number,
  wsBonus: number,
  wsTrait: number,
  pdlTrait: number,
  pdlGear: number,
  sneakAttackBonus = 0,
  trickAttackBonus = 0,
  climacticFlourishBonus = 0,
  strikingFlourishBonus = 0,
  ternaryFlourishBonus = 0
) => {
  const fSTR = getFStr(weaponBaseDamage, str, vit);
  const pDIF = getPdif(
    wpn_type_skill,
    playerAttack,
    enemyDefense,
    pdlTrait,
    pdlGear
  );
  const numHits = dw ? wsNumHits + 1 : wsNumHits;
  let wsDmg = 0;
  for (let i = 0; i < numHits; i++) {
    const isCrit = Math.random() < critRate;
    wsDmg =
      wsDmg +
      calcWSHit(
        weaponBaseDamage,
        fSTR,
        wsc,
        pDIF,
        fTP,
        isCrit,
        critDamageBonus,
        wsd,
        wsBonus,
        wsTrait,
        i,
        sneakAttackBonus,
        trickAttackBonus,
        climacticFlourishBonus,
        strikingFlourishBonus,
        ternaryFlourishBonus
      );
  }
  return wsDmg;
};

const getPdif = (
  wpn_type_skill:
    | "Katana"
    | "Dagger"
    | "Sword"
    | "Axe"
    | "Club"
    | "Great Katana"
    | "Hand-to-Hand"
    | "Great Sword"
    | "Staff"
    | "Great Axe"
    | "Polearm"
    | "Scythe",
  playerAttack: number,
  enemyDefense: number,
  pdlTrait = 0, // Default 0 Trait
  pdlGear = 0, // Default 0 PDL
  crit = 0 // Default non-crit, set to 1 for crit
) => {
  let pdif_base_cap = 0;
  if (
    wpn_type_skill == "Katana" ||
    wpn_type_skill == "Dagger" ||
    wpn_type_skill == "Sword" ||
    wpn_type_skill == "Axe" ||
    wpn_type_skill == "Club"
  )
    pdif_base_cap = 3.25;
  else if (wpn_type_skill == "Great Katana" || wpn_type_skill == "Hand-to-Hand")
    pdif_base_cap = 3.5;
  else if (
    wpn_type_skill == "Great Sword" ||
    wpn_type_skill == "Staff" ||
    wpn_type_skill == "Great Axe" ||
    wpn_type_skill == "Polearm"
  )
    pdif_base_cap = 3.75;
  else if (wpn_type_skill == "Scythe") pdif_base_cap = 4.0;

  const ratio = playerAttack / enemyDefense;
  const cratio = ratio; // Ignore level differences
  const wratio = crit ? cratio + 1 : cratio; // Add 1.0 if crit

  let upper_qlim = 0;
  let lower_qlim = 0;

  // qRatio stuff taken from BG
  if (wratio >= 0.0 && wratio < 0.5) upper_qlim = wratio + 0.5;
  else if (wratio >= 0.5 && wratio < 0.7) upper_qlim = 1;
  else if (wratio >= 0.7 && wratio < 1.2) upper_qlim = wratio + 0.3;
  else if (wratio >= 1.2 && wratio < 1.5) upper_qlim = 1.25 * wratio;
  else if (wratio >= 1.5) upper_qlim = wratio + 0.375;

  if (wratio >= 0.0 && wratio < 0.38) lower_qlim = 0;
  else if (wratio >= 0.38 && wratio < 1.25)
    lower_qlim = (1176.0 / 1024.0) * wratio - 448.0 / 1024.0;
  else if (wratio >= 1.25 && wratio < 1.51) lower_qlim = 1;
  else if (wratio >= 1.51 && wratio < 2.44)
    lower_qlim = (1176.0 / 1024.0) * wratio - 755.0 / 1024.0;
  else if (wratio >= 2.44) lower_qlim = wratio - 0.375;

  const qratio = Math.random() * (upper_qlim - lower_qlim) + lower_qlim;

  // Define your capped PDIF value
  const pdif_cap = (pdif_base_cap + pdlTrait) * (1 + pdlGear);
  let pdif = 0;

  //  Limit PDIF to between 0 and cap.
  if (qratio <= 0) pdif = 0;
  else if (qratio >= pdif_cap) pdif = pdif_cap;
  else pdif = qratio;

  // Add 1.0 to PDIF value if crit.
  if (crit) pdif += 1.0;

  // Random multiplier to final PDIF value
  pdif *= Math.random() * (1.05 - 1.0) + 1.0;

  return pdif;
};

const getFStr = (dmg: number, str: number, vit: number) => {
  const dstr = str - vit;
  let fstr = 0;
  if (dstr <= -22) fstr = (dstr + 13) / 4;
  else if (dstr <= -16) fstr = (dstr + 12) / 4;
  else if (dstr <= -8) fstr = (dstr + 10) / 4;
  else if (dstr <= -3) fstr = (dstr + 9) / 4;
  else if (dstr <= 0) fstr = (dstr + 8) / 4;
  else if (dstr <= 5) fstr = (dstr + 7) / 4;
  else if (dstr < 12) fstr = (dstr + 6) / 4;
  else if (dstr >= 12) fstr = (dstr + 4) / 4;

  if (fstr < (-1 * dmg) / 9.0) fstr = (-1 * dmg) / 9.0;
  else if (fstr > 8 + dmg / 9.0) fstr = 8 + dmg / 9.0;

  return fstr;
};

const calcWSHit = (
  weaponBaseDamage: number,
  fStr: number,
  wsc: number,
  pDIF: number,
  fTP: number,
  crit: boolean,
  critDamageBonus: number,
  wsd: number,
  wsBonus: number,
  wsTrait: number,
  round: number,
  sneakAttackBonus = 0,
  trickAttackBonus = 0,
  climacticFlourishBonus = 0,
  strikingFlourishBonus = 0,
  ternaryFlourishBonus = 0
) => {
  const isFirstRound = round === 0;

  let damage =
    (weaponBaseDamage + fStr + wsc) *
    fTP *
    (isFirstRound ? (1 + wsd) : 1) *
    (1 + wsBonus) *
    (1 + wsTrait);

  if (isFirstRound) {
    damage = damage + sneakAttackBonus;
    damage = damage + trickAttackBonus;
    damage = damage + climacticFlourishBonus;
    damage = damage + strikingFlourishBonus;
    damage = damage + ternaryFlourishBonus;
  }

  damage = damage * pDIF;

  if (crit) {
    damage = damage * (1 + Math.min(critDamageBonus, 1.0)); // Min caps critical damage bonus at 100%. See https://www.bg-wiki.com/ffxi/Crit._Atk._Bonus
  }

  return damage;
};
