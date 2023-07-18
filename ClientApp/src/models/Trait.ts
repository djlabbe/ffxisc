export interface Trait {
    name: string,
    spells: TraitSpell[],
    tierValues: string[] | number[]
}

export interface TraitSpell {
    name: string,
    points: number,
    cost: number,
    id: number
}


export default Trait