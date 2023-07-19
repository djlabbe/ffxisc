import { WeaponTypeKey } from "./WeaponSkillParams"

export interface WeaponSkill {
    name: string,
    skill: WeaponTypeKey,
    properties: string[],
    jobs: WSJob[]
    modifiers: WSModifier[],
    ftpReplicating: boolean,
    ftp: number[],
    class: string,
    hits: number
    aeonic?: string,
    weapon?: string,
}

export interface WSJob {
    job: string,
    level: number,
}

export interface WSModifier {
    stat: string,
    value: number,
}