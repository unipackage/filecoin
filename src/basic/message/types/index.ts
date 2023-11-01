import { Cid } from "../../cid/types"
import { Entity } from "@unipackage/ddd"

export interface BlsMessage {
    Version: number
    To: string
    From: string
    Nonce: number
    Value: string
    GasLimit: number
    GasFeeCap: string
    GasPremium: string
    Method: number
    Params: string
    CID: Cid
}

export interface SecpkMessage {
    Message: BlsMessage
    Signature: {
        Type: number
        Data: string
    }
    CID: Cid
}

export interface MsgRct {
    ExitCode: number
    Return: any
    GasUsed: number
    EventsRoot?: any
}

export interface GasCost {
    Message: Cid
    GasUsed: string
    BaseFeeBurn: string
    OverEstimationBurn: string
    MinerPenalty: string
    MinerTip: string
    Refund: string
    TotalCost: string
}

export interface Message {
    Height: number
    Replayed: boolean

    MsgCid: Cid
    Msg: BlsMessage

    MsgRct?: MsgRct
    GasCost?: GasCost
}

export class Message extends Entity<Message> {}
