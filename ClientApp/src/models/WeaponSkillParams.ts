const WEAPONTYPES = [
  "Katana",
  "Dagger",
  "Sword",
  "Axe",
  "Club",
  "Great Katana",
  "Hand-to-Hand",
  "Great Sword",
  "Staff",
  "Great Axe",
  "Polearm",
  "Scythe",
] as const;

export type WeaponTypeKey = typeof WEAPONTYPES[number]

export function isWeaponType(weaponTypeKey: string): weaponTypeKey is WeaponTypeKey {
    return WEAPONTYPES.includes(weaponTypeKey as WeaponTypeKey)
  }

export interface WeaponSkillParams {
  weaponType: WeaponTypeKey;
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
  tp: string;
}
