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

import "mocha"
import { ChainFilecoinRPC } from "../../src/chain/repo/rpc" // Replace with the actual path to your TypeScript file
import * as dotenv from "dotenv"
import { Context } from "mocha"
import { expect } from "chai"
import { Tipset } from "../../src/basic/tipset/types"
import { BlockMessagesToMessages } from "../../src/shared/blockMsgsToMsgs"
import {
    GetRepalyedMessages,
    GetBlockMessagesesByTipset,
} from "../../src/shared/utils"
import {
    AllReplayStrategy,
    AddressesFilterReplayStrategy,
} from "../../src/shared/replayStrategy"
import assert from "assert"
import { Message } from "../../src/basic/message/types"
dotenv.config()

describe("GetRepalyedMessages", () => {
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })
    let tipset: Tipset
    let messages: Message[]

    beforeEach(async function (this: Context) {
        this.timeout(10000)
        const resHead = await rpc.ChainHead()
        expect(resHead.ok).to.be.true
        expect(resHead.data).to.be.instanceOf(Tipset)
        tipset = resHead.data as Tipset

        const resBlockMsgs = await GetBlockMessagesesByTipset(rpc, tipset)
        if (resBlockMsgs.data?.length) {
            messages = BlockMessagesToMessages(resBlockMsgs.data, resHead.data!)
        }
    })

    describe("#GetRepalyedMessages", () => {
        it("not replay", async function (this: Context) {
            this.timeout(10000)
            const replayedMsgs = await GetRepalyedMessages(
                rpc,
                messages,
                tipset,
                {
                    replay: false,
                }
            )
            assert.deepStrictEqual(messages, replayedMsgs.data)
        })

        it("all replay", async function (this: Context) {
            this.timeout(10000)
            const replayedMsgs = await GetRepalyedMessages(
                rpc,
                messages,
                tipset,
                {
                    replay: true,
                    replayStrategy: new AllReplayStrategy(),
                }
            )
            assert.deepStrictEqual(messages.length, replayedMsgs.data?.length)
            if (messages.length > 0) {
                assert.notEqual(messages, replayedMsgs.data)
            }
        })

        it("special address replay", async function (this: Context) {
            this.timeout(10000)
            const replayedMsgs = await GetRepalyedMessages(
                rpc,
                messages,
                tipset,
                {
                    replay: true,
                    replayStrategy: new AddressesFilterReplayStrategy([
                        "not-matched-any-address",
                    ]),
                }
            )
            //equal not replay
            assert.deepStrictEqual(messages, replayedMsgs.data)
        })
    })
})
