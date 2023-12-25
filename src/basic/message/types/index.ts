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
import { Entity } from "@unipackage/ddd"

// BlsMessage interface representing a BLS signature message
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
    CID: CidProperty
}

// SecpkMessage interface representing a secpk signature message
export interface SecpkMessage {
    Message: BlsMessage
    Signature: {
        Type: number
        Data: string
    }
    CID: CidProperty
}

// MsgRct interface representing the receipt of a message
export interface MsgRct {
    ExitCode: number
    Return: any
    GasUsed: number
    EventsRoot?: any
}

// GasCost interface representing the gas cost associated with a message
export interface GasCost {
    Message: CidProperty
    GasUsed: string
    BaseFeeBurn: string
    OverEstimationBurn: string
    MinerPenalty: string
    MinerTip: string
    Refund: string
    TotalCost: string
}

// Message interface representing a message
export interface Message {
    Height: number
    Replayed: boolean

    MsgCid: CidProperty
    Msg: BlsMessage

    MsgRct?: MsgRct
    GasCost?: GasCost
}

// Message class extending Entity for modeling messages as entities
export class Message extends Entity<Message> {}
