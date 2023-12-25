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
import "mocha"
import { Block, BlockMessages } from "../../src/basic/block/types" // Replace with the actual path to your TypeScript file

describe("Block Entity", () => {
    it("should create a valid Block entity", () => {
        const blockData = new Block({
            Miner: "miner1",
            Ticket: {
                VRFProof: "vrfProof1",
            },
            ElectionProof: {
                WinCount: 1,
                VRFProof: "electionProof1",
            },
            BeaconEntries: [
                {
                    Round: 1,
                    Data: "beaconData1",
                },
            ],
            WinPoStProof: [
                {
                    PoStProof: 1,
                    ProofBytes: "proofBytes1",
                },
            ],
            Parents: [],
            ParentWeight: "100",
            Height: 2,
            ParentStateRoot: { "/": "" },
            ParentMessageReceipts: { "/": "" },
            Messages: { "/": "" },
            BLSAggregate: {
                Type: 1,
                Data: "blsAggregateData1",
            },
            Timestamp: 1234567890,
            BlockSig: {
                Type: 1,
                Data: "blockSigData1",
            },
            ForkSignaling: 0,
            ParentBaseFee: "20",
        })

        const blockEntity = new Block(blockData)

        expect(blockEntity).to.be.an.instanceOf(Block)
    })
})

describe("BlockMessages Entity", () => {
    it("should create a valid BlockMessages entity", () => {
        const blockMessagesData = new BlockMessages({
            // Add sample data for testing
            BlockCid: { "/": "" },
            Height: 3,
            Cids: [],
            BlsMessages: [
                {
                    Version: 1,
                    To: "toAddress1",
                    From: "fromAddress1",
                    Nonce: 1,
                    Value: "100",
                    GasLimit: 1000,
                    GasFeeCap: "10",
                    GasPremium: "5",
                    Method: 1,
                    Params: "params1",
                    CID: { "/": "" },
                },
            ],
            SecpkMessages: [
                {
                    Message: {
                        Version: 1,
                        To: "toAddress2",
                        From: "fromAddress2",
                        Nonce: 2,
                        Value: "200",
                        GasLimit: 2000,
                        GasFeeCap: "20",
                        GasPremium: "10",
                        Method: 2,
                        Params: "params2",
                        CID: { "/": "" },
                    },
                    Signature: {
                        Type: 1,
                        Data: "signatureData1",
                    },
                    CID: { "/": "" },
                },
            ],
        })

        const blockMessagesEntity = new BlockMessages(blockMessagesData)

        expect(blockMessagesEntity).to.be.an.instanceOf(BlockMessages)
    })
})
