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

import { expect } from "chai"
import { describe, it } from "mocha"
import { BlockMessages } from "../../src/basic/block/types"
import { CidProperty } from "../../src/basic/cid/types"
import { BlsMessage, SecpkMessage } from "../../src/basic/message/types"
import { Tipset } from "../../src/basic/tipset/types"
import { BlockMessagesToMessages } from "../../src/shared/blockMsgsToMsgs"

function generateSecpkMsg(cid: CidProperty): SecpkMessage {
    return {
        Message: generateBlsMsg(cid),
        Signature: {
            Type: 0,
            Data: "",
        },
        CID: cid,
    }
}

function generateBlsMsg(cid: CidProperty): BlsMessage {
    return {
        Version: 0,
        To: "",
        From: "",
        Nonce: 0,
        Value: "",
        GasLimit: 0,
        GasFeeCap: "",
        GasPremium: "",
        Method: 0,
        Params: "",
        CID: cid,
    }
}

describe("BlockMessagesToMessages", () => {
    it("should convert BlockMessages to Messages ok", () => {
        const tipset: Tipset = new Tipset({
            Cids: [{ "/": "cid1" }, { "/": "cid2" }],
            Height: 1,
            Blocks: [],
        })

        const blockMessagesArray: BlockMessages[] = [
            new BlockMessages({
                BlockCid: { "/": "cid1" },
                Height: 1,
                Cids: [],
                BlsMessages: [
                    generateBlsMsg({ "/": "msgcid1" }),
                    generateBlsMsg({ "/": "msgcid2" }),
                ],
                SecpkMessages: [
                    generateSecpkMsg({ "/": "msgcid1" }),
                    generateSecpkMsg({ "/": "msgcid3" }),
                ],
            }),
        ]

        const result = BlockMessagesToMessages(blockMessagesArray, tipset)
        expect(result.length).to.be.equal(3)
    })

    it("should convert BlockMessages to Messages failed", () => {
        const tipset: Tipset = new Tipset({
            Cids: [{ "/": "cid1" }, { "/": "cid2" }],
            Height: 1,
            Blocks: [],
        })

        const blockMessagesArray: BlockMessages[] = [
            new BlockMessages({
                BlockCid: { "/": "cid4" },
                Height: 1,
                Cids: [],
                BlsMessages: [
                    generateBlsMsg({ "/": "msgcid1" }),
                    generateBlsMsg({ "/": "msgcid2" }),
                ],
                SecpkMessages: [
                    generateSecpkMsg({ "/": "msgcid1" }),
                    generateSecpkMsg({ "/": "msgcid3" }),
                ],
            }),
        ]

        try {
            BlockMessagesToMessages(blockMessagesArray, tipset)
            expect.fail("Expected an error but none was thrown")
        } catch (error: any) {
            expect(error.message).to.equal(
                `Block {"/":"cid4"} is not in the tipset with height 1`
            )
        }
    })
})
