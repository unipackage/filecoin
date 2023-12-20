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

import { Result } from "@unipackage/utils"
import { IEVM } from "@unipackage/net"
import { Message } from "../../message/types"
import { ContractMessage } from "../types"

/**
 * ContractMessageDecoder class for decoding contract messages.
 */
export class ContractMessageDecoder {
    private evm: IEVM

    /**
     * Creates an instance of ContractMessageDecoder.
     * @param evm - Instance of the Ethereum Virtual Machine (EVM) for decoding.
     */
    constructor(evm: IEVM) {
        this.evm = evm
    }

    /**
     * Decode a Message into a ContractMessage.
     * @param msg - Message to decode.
     * @returns Result object containing the decoded ContractMessage or an error.
     */
    decode(msg: Message): Result<ContractMessage> {
        // Decode the input parameters of the transaction
        const decodeInputRes = this.evm.decodeTxInputToEvmInput(msg.Msg.Params)

        // Check if decoding was successful
        if (!decodeInputRes.ok || !decodeInputRes.data) {
            return { ok: false, error: decodeInputRes.error }
        }

        // Check if MsgRct is present
        if (!msg.MsgRct) {
            return { ok: false, error: "Missing MsgRct!" }
        }

        // Create a ContractMessage with decoded information
        const dsmsg: ContractMessage = new ContractMessage({
            cid: msg.MsgCid,
            height: msg.Height,
            timestamp: "", // Add timestamp logic here if available
            from: msg.Msg.From,
            to: msg.Msg.To,
            method: decodeInputRes.data.method,
            params: decodeInputRes.data.params,
            status: msg.MsgRct.ExitCode,
        })

        // Return the result with the ContractMessage
        return {
            ok: true,
            data: dsmsg,
        }
    }
}
