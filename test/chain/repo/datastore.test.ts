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
import assert from "assert"
import { messageDs, blockDs, tipsetDs } from "../../helper/mongodb/instance"
import { ChainFilecoinRPC } from "../../../src/chain/repo/rpc" // Replace with the actual path to your TypeScript file
import { Context } from "mocha"
import { expect } from "chai"
import { Tipset } from "../../../src/basic/tipset/types"
import { BlockMessages } from "../../../src/basic/block/types"
import { Message } from "../../../src/basic/message/types"
import { BlockMessagesToMessages } from "../../../src/shared/blockMsgsToMsgs"
import * as dotenv from "dotenv"
dotenv.config()

describe("Datastore", () => {
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })
    let tipset: Tipset
    let blockMessages: BlockMessages
    let messages: Message[]

    beforeEach(async function (this: Context) {
        this.timeout(10000)
        await tipsetDs.connect()
        await blockDs.connect()
        await messageDs.connect()

        // get tipset
        const resHead = await rpc.ChainHead()
        expect(resHead.ok).to.be.true
        tipset = resHead.data as Tipset

        // get blockMessages
        const resBlockMessages = await rpc.ChainGetBlockMessages(
            tipset,
            tipset.Cids![0]
        )
        expect(resBlockMessages.ok).to.be.true
        blockMessages = resBlockMessages.data as BlockMessages

        // get message
        messages = BlockMessagesToMessages([blockMessages], tipset)
    })

    afterEach(async function (this: Context) {
        await tipsetDs.disconnect()
        await blockDs.disconnect()
        await messageDs.disconnect()
    })

    describe("tipset datastore", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            await tipsetDs.CreateOrupdateByUniqueIndexes(tipset.value())
            const findRes = await tipsetDs.find({
                conditions: [{ Height: tipset.Height }],
            })
            expect(findRes.data?.length).to.be.equal(1)
            expect(findRes.data![0].Height).to.be.equal(tipset.Height)
        })
    })

    describe("block datastore", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            await blockDs.CreateOrupdateByUniqueIndexes(blockMessages.value())
            const findRes = await blockDs.find({
                conditions: [{ BlockCid: blockMessages.BlockCid }],
            })
            expect(findRes.data?.length).to.be.equal(1)
            assert.deepStrictEqual(
                findRes.data![0].BlockCid,
                blockMessages.BlockCid
            )
        })
    })

    describe("Message datastore", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            if (messages.length > 0) {
                await messageDs.CreateOrupdateByUniqueIndexes(
                    messages[0].value()
                )
                const findRes = await messageDs.find({
                    conditions: [{ MsgCid: messages[0].MsgCid }],
                })
                expect(findRes.data?.length).to.be.equal(1)
                assert.deepStrictEqual(
                    findRes.data![0].MsgCid,
                    messages[0].MsgCid
                )
            }
        })
    })
})
