import { Cid } from "../../cid/types"
import { Block } from "../../block/types"
import { Entity } from "@unipackage/ddd"

export interface TipsetProperties {
    Height: number
    Cids: Array<Cid>
    Blocks: Array<Block>
}

export interface Tipset extends TipsetProperties {}
export class Tipset extends Entity<Tipset> {}
