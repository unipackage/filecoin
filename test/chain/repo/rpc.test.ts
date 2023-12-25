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
import { ChainFilecoinRPC } from "../../../src/chain/repo/rpc" // Replace with the actual path to your TypeScript file
import * as dotenv from "dotenv"
import { Context } from "mocha"
import { expect } from "chai"
import { Tipset } from "../../../src/basic/tipset/types"
import { Message } from "../../../src/basic/message/types"
import { BlockMessages } from "../../../src/basic/block/types"
dotenv.config()

describe("RPC", () => {
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })

    describe("ChainHead", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const res = await rpc.ChainHead()
            expect(res.ok).to.be.true
            expect(res.data).to.be.instanceOf(Tipset)
        })
    })

    describe("ChainGetTipSetByHeight", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const chainHeadRes = await rpc.ChainHead()
            const res = await rpc.ChainGetTipSetByHeight(
                chainHeadRes.data?.Height!,
                chainHeadRes.data?.Cids!
            )
            expect(res.data!.equal(chainHeadRes.data!)).to.equal(true)
            expect(res.data).to.be.instanceOf(Tipset)
        })
    })

    describe("ChainGetBlockMessages", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const chainHeadRes = await rpc.ChainHead()
            const res = await rpc.ChainGetBlockMessages(
                chainHeadRes.data!,
                chainHeadRes.data!.Cids![0]
            )
            expect(res.ok).to.be.equal(true)
            expect(res.data).to.be.instanceOf(BlockMessages)
        })
    })

    describe("StateReplay", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const chainHeadRes = await rpc.ChainHead()
            const msgRes = await rpc.ChainGetBlockMessages(
                chainHeadRes.data!,
                chainHeadRes.data!.Cids![0]
            )
            expect(msgRes.ok).to.be.equal(true)

            if (msgRes.data!.BlsMessages.length > 0) {
                const res = await rpc.StateReplay(
                    chainHeadRes.data!,
                    msgRes.data!.BlsMessages[0].CID
                )
                expect(res.ok).to.be.equal(true)
                expect(res.data?.MsgRct).to.be.not.undefined
                expect(res.data?.GasCost).to.be.not.undefined
                expect(res.data).to.be.instanceOf(Message)
            }
        })
    })
})
