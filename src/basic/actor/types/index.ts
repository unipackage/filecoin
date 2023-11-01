import { Cid } from "../../cid/types"
import { Balance } from "../../balance/types"
import { Address } from "../../address/types"
import { Entity } from "@unipackage/ddd"
import {
    ActorCode,
    ActorName,
    getActorName as glifgetActorName,
    NetworkName,
} from "@glif/filecoin-actor-utils"

export interface Actor {
    Code: ActorCode
    Head: Cid
    Nonce: number
    Balance: Balance
    Address: Address
}

export class Actor extends Entity<Actor> {
    getActorName(networkName: NetworkName): ActorName | null {
        return glifgetActorName(this.Code, networkName)
    }
}
