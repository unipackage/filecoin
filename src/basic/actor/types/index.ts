import { Cid } from "../../cid/types"
import { Balance } from "../../balance/types"
import { Address } from "../../address/types"

export enum ActorType {
    Miner = 0,
    MultiSignAddress,
    Other,
    Unkown,
}

export const ActorCode = {
    MultiSignAddress: {
        "/": "bafk2bzaceafajceqwg5ybiz7xw6rxammuirkgtuv625gzaehsqfprm4bazjmk",
    },
    Miner: {
        "/": "bafk2bzacec24okjqrp7c7rj3hbrs5ez5apvwah2ruka6haesgfngf37mhk6us",
    },
}

export interface ActorProperties {
    Code: Cid
    Head: Cid
    Nonce: number
    Balance: Balance
    Address: Address
}

export class Actor {
    properties: ActorProperties
    constructor(actorInfo: ActorProperties) {
        this.properties = actorInfo
    }

    type(): ActorType {
        switch (JSON.stringify(this.properties.Code)) {
            case JSON.stringify(ActorCode.Miner):
                return ActorType.Miner
            case JSON.stringify(ActorCode.MultiSignAddress):
                return ActorType.MultiSignAddress
            default:
                break
        }
        return ActorType.Other
    }
}
