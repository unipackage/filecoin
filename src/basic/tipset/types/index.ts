import { Cid } from "../../cid/types"
import { Block } from "../../block/types"
import { Entity } from "@unipackage/ddd"

export interface Tipset {
    Height: number
    Cids: Array<Cid>
    Blocks: Array<Block>
}

export class Tipset extends Entity<Tipset> {}
