/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import { CidProperty } from "../../cid/types"
import { BlsMessage, SecpkMessage } from "../../message/types"
import { Entity } from "@unipackage/ddd"

// Define the interface for a Block
export interface Block {
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
    Parents: Array<CidProperty>
    ParentWeight: string
    Height: number
    ParentStateRoot: CidProperty
    ParentMessageReceipts: CidProperty
    Messages: CidProperty
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

// Define the interface for BlockMessages
export interface BlockMessages {
    BlockCid: CidProperty
    Height?: number
    Cids: Array<CidProperty>
    BlsMessages: Array<BlsMessage>
    SecpkMessages: Array<SecpkMessage>
}

// Define the class for Block entities
export class Block extends Entity<Block> {}

// Define the class for BlockMessages entities
export class BlockMessages extends Entity<BlockMessages> {}
