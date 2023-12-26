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

import { ContractMessageDecoder } from "../../src/contractMessage/decoder"
import { proofEvm } from "./env"
import "mocha"
import { ChainFilecoinRPC } from "../../src/chain/repo/rpc" // Replace with the actual path to your TypeScript file
import { Context } from "mocha"
import { expect } from "chai"
import { Tipset } from "../../src/basic/tipset/types"
import { Message } from "../../src/basic/message/types"
import { BlockMessagesToMessages } from "../../src/shared/blockMsgsToMsgs"
import {
    GetBlockMessagesesByTipset,
    GetRepalyedMessages,
} from "../../src/shared/utils"
import * as dotenv from "dotenv"
import assert from "assert"
import { ContractMessage } from "../../src/contractMessage/types"
dotenv.config()

describe("ContractMessageDecoder", () => {
    const contractMessageDecoder = new ContractMessageDecoder(proofEvm)
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })
    let tipset: Tipset
    let message: Message

    beforeEach(async function (this: Context) {
        this.timeout(10000)
        // get tipset
        const resHead = await rpc.ChainHead()
        expect(resHead.ok).to.be.true

        // get blockMessages
        const resTipset = await rpc.ChainGetTipSetByHeight(
            1208237,
            resHead.data!.Cids
        )
        tipset = resTipset.data as Tipset

        const blockMessagesRes = await GetBlockMessagesesByTipset(rpc, tipset)
        let messages = BlockMessagesToMessages(blockMessagesRes.data!, tipset)
        const messagesRes = await GetRepalyedMessages(rpc, messages, tipset, {
            replay: true,
        })
        messages = messagesRes.data!
        message = messages.find((msg) => {
            return (
                msg.MsgCid["/"] ===
                "bafy2bzacec4hzkwxcwdesy6ae3jcwhgdjhxjmh2xrlmhhr6dvugqava3frrzm"
            )
        }) as Message
    })

    describe("#decoder", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const contractMessage = contractMessageDecoder.decode(message)
            const expect = {
                ok: true,
                data: new ContractMessage({
                    cid: {
                        "/": "bafy2bzacec4hzkwxcwdesy6ae3jcwhgdjhxjmh2xrlmhhr6dvugqava3frrzm",
                    },
                    height: 1208237,
                    timestamp: "",
                    from: "f410fhuebctou6znv3xghmceeesoz2gxegxpoopw46jq",
                    to: "f410few7qcnlenzfodimzo72ki7kmh5zlg6munfg5l4q",
                    method: "appendDatasetCollateral",
                    params: [BigInt(1)],
                    status: 0,
                    return: "0x",
                }),
            }
            assert.deepStrictEqual(contractMessage, expect)
        })
    })
})
