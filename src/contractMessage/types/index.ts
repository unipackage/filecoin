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

import { CidProperty } from "../../basic/cid/types"
import { ValueFields } from "@unipackage/utils"

/**
 * Interface representing a ContractMessage.
 */
export interface ContractMessage {
    /** CID (Content Identifier) of the contract message. */
    cid: CidProperty
    /** Height at which the contract message was included in a block. */
    height: number
    /** Timestamp indicating when the contract message was processed. */
    timestamp: string
    /** Sender's address from which the contract message originates. */
    from: string
    /** Recipient's address to which the contract message is directed. */
    to: string
    /** The amount sent by the contract message. */
    value: string
    /** Method associated with the contract message. */
    method: string
    /** Parameters of the contract message. */
    params: any
    /** Status code indicating the result of the contract message execution. */
    status?: string | number
    /** Return indicating the result of the contract message execution. */
    return?: any
}

/**
 * class representing a ContractMessage.
 */
export class ContractMessage {
    /**
     * Creates an instance of the ContractMessage.
     * @param data - The initial data for the ContractMessage.
     */
    constructor(data: ValueFields<ContractMessage>) {
        if (!data) {
            throw new Error("Invalid data provided to the constructor")
        }
        Object.assign(this, data)
    }

    /**
     * Gets the values of the ContractMessage.
     * @returns ValueFields<ContractMessage>.
     */
    values(): ValueFields<ContractMessage> {
        return Object.fromEntries(
            Object.entries(this)
                .filter(([key, value]) => this.hasOwnProperty(key) && typeof value !== "function")
        ) as ValueFields<ContractMessage>;
    }
}
