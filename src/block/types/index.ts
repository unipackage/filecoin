import { Cid } from "../../cid/types"
import { BlsMessage, SecpkMessage } from "../../message/types"
import { Entity } from "@unipackage/ddd"

export interface BlockProperties {
    Miner: string
    Ticket: {
        VRFProof: string
    }
    ElectionProof: {
        WinCount: number
        VRFProof: string
    }
    BeaconEntries: Array<{
        Round: number
        Data: string
    }>
    WinPoStProof: Array<{
        PoStProof: number
        ProofBytes: string
    }>
    Parents: Array<Cid>
    ParentWeight: string
    Height: number
    ParentStateRoot: Cid
    ParentMessageReceipts: Cid
    Messages: Cid
    BLSAggregate: {
        Type: number
        Data: string
    }
    Timestamp: number
    BlockSig: {
        Type: number
        Data: string
    }
    ForkSignaling: number
    ParentBaseFee: string
}

export interface BlockMessagesProperties {
    BlockCid: Cid
    Height?: number

    Cids: Array<Cid>
    BlsMessages: Array<BlsMessage>
    SecpkMessages: Array<SecpkMessage>
}

export interface Block extends BlockProperties {}
export class Block extends Entity<Block> {}

export interface BlockMessages extends BlockMessagesProperties {}
export class BlockMessages extends Entity<BlockMessages> {}
