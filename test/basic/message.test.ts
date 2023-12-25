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
import {
    BlsMessage,
    SecpkMessage,
    MsgRct,
    GasCost,
    Message,
} from "../../src/basic/message/types" // Replace with the actual path to your TypeScript file
import { Cid } from "../../src/basic/cid/types"

describe("Message", () => {
    const blsMessage: BlsMessage = {
        Version: 1,
        To: "address1",
        From: "address2",
        Nonce: 123,
        Value: "100",
        GasLimit: 1000,
        GasFeeCap: "10",
        GasPremium: "5",
        Method: 1,
        Params: "param1",
        CID: { "/": "" },
    }

    const secpkMessage: SecpkMessage = {
        Message: blsMessage,
        Signature: {
            Type: 1,
            Data: "signatureData",
        },
        CID: { "/": "" },
    }

    const msgRct: MsgRct = {
        ExitCode: 0,
        Return: "success",
        GasUsed: 500,
        EventsRoot: {},
    }

    const gasCost: GasCost = {
        Message: { "/": "" },
        GasUsed: "200",
        BaseFeeBurn: "50",
        OverEstimationBurn: "10",
        MinerPenalty: "5",
        MinerTip: "2",
        Refund: "2",
        TotalCost: "269",
    }

    describe("#BlsMessage", () => {
        it("should have valid properties", () => {
            expect(blsMessage).to.have.property("Version")
        })
    })

    describe("#SecpkMessage", () => {
        it("should have valid properties", () => {
            expect(secpkMessage).to.have.property("Message")
        })
    })

    describe("#MsgRct", () => {
        it("should have valid properties", () => {
            expect(msgRct).to.have.property("ExitCode")
        })
    })

    describe("#GasCost", () => {
        it("should have valid properties", () => {
            expect(gasCost).to.have.property("Message")
        })
    })

    describe("#Message Entity", () => {
        it("should create a valid Message entity", () => {
            const messageEntity = new Message({
                MsgCid: { "/": "" },
                Height: 1000,
                Replayed: true,
                Msg: blsMessage,
                MsgRct: msgRct,
                GasCost: gasCost,
            })

            expect(messageEntity).to.be.an.instanceOf(Message)
        })
    })
})
