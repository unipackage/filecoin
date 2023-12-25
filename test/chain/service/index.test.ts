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

import { messageDs, blockDs, tipsetDs } from "../../helper/mongodb/instance"
import "mocha"
import { ChainFilecoinRPC } from "../../../src/chain/repo/rpc" // Replace with the actual path to your TypeScript file
import { ChainService } from "../../../src/chain/service" // Replace with the actual path to your TypeScript file
import * as dotenv from "dotenv"
import { Context } from "mocha"
import { expect } from "chai"
import { Chain } from "../../../src/chain/types"
import assert from "assert"
dotenv.config()

describe("ChainService", () => {
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })
    const chainService = new ChainService({
        rpc,
        messageDs,
        blockMessagesDs: blockDs,
        tipsetDs,
    })

    beforeEach(async () => {
        await tipsetDs.connect()
        await blockDs.connect()
        await messageDs.connect()
    })

    afterEach(async () => {
        await tipsetDs.disconnect()
        await blockDs.disconnect()
        await messageDs.disconnect()
    })

    describe("GetAndSaveChainInfoByHeight", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const resHead = await rpc.ChainHead()

            const res = await chainService.GetAndSaveChainInfoByHeight(
                resHead.data?.Height!
            )
            expect(res.ok).to.be.true

            //tipset datastore check
            const tipsetFindRes = await tipsetDs.find({
                conditions: [{ Height: resHead.data?.Height }],
            })
            expect(tipsetFindRes.data?.length).to.be.equal(1)
            expect(tipsetFindRes.data![0].Height).to.be.equal(
                resHead.data?.Height
            )

            //block message datastore check
            const blockMessageFindRes = await blockDs.find({
                conditions: [{ BlockCid: resHead.data?.Cids[0] }],
            })
            expect(blockMessageFindRes.data?.length).to.be.equal(1)
            assert.deepStrictEqual(
                blockMessageFindRes.data![0].BlockCid,
                resHead.data?.Cids[0]
            )

            //message datastore check
        })
    })

    describe("GetChainInfoByHeight and SaveChainInfo", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const resHead = await rpc.ChainHead()

            const resChainInfo = await chainService.GetChainInfoByHeight(
                resHead.data?.Height!
            )
            expect(resChainInfo.ok).to.be.true
            expect(resChainInfo.data).to.be.instanceOf(Chain)

            const res = await chainService.SaveChainInfo(resChainInfo.data!)
            expect(res.ok).to.be.true
        })
    })
})
