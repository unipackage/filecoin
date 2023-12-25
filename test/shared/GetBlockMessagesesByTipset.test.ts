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
import { GetBlockMessagesesByTipset } from "../../src/shared/utils"
import { BlockMessages } from "../../src/basic/block/types"
dotenv.config()

describe("GetBlockMessagesesByTipset", () => {
    const rpc = new ChainFilecoinRPC({
        apiAddress: process.env.LOTUS_API_ENDPOINT as string,
        token: process.env.LOTUS_TOKEN,
    })

    describe("#GetBlockMessagesesByTipset", () => {
        it("should ok", async function (this: Context) {
            this.timeout(10000)
            const resHead = await rpc.ChainHead()
            expect(resHead.ok).to.be.true
            expect(resHead.data).to.be.instanceOf(Tipset)
            const res = await GetBlockMessagesesByTipset(rpc, resHead.data!)
            expect(res.ok).to.be.true
            expect(res.data).to.be.an("array")
            for (const blockMessages of res.data!) {
                expect(blockMessages).to.be.instanceOf(BlockMessages)
            }
        })
    })
})
