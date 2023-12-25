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
import {
    AddressesFilterReplayStrategy,
    AllReplayStrategy,
    DefaultReplayStrategy,
} from "../../src/shared/replayStrategy"
import { Message } from "../../src/basic/message/types"

describe("ReplayStrategy", () => {
    describe("#AddressesFilterReplayStrategy", () => {
        it("should replay messages based on specified addresses", () => {
            // Mock data for testing
            const addresses = ["address1", "address2"]
            const strategy = new AddressesFilterReplayStrategy(addresses)

            // Test messages
            const messageToReplay = { Msg: { From: "address1" } } as Message
            const messageNotToReplay = { Msg: { From: "address3" } } as Message

            // Assertions
            expect(strategy.shouldReplay(messageToReplay)).to.equal(true)
            expect(strategy.shouldReplay(messageNotToReplay)).to.equal(false)
        })
    })

    describe("#AllReplayStrategy", () => {
        it("should replay all messages", () => {
            const strategy = new AllReplayStrategy()

            // Test messages
            const message1 = { Msg: { From: "address1" } } as Message
            const message2 = { Msg: { From: "address2" } } as Message

            // Assertions
            expect(strategy.shouldReplay(message1)).to.equal(true)
            expect(strategy.shouldReplay(message2)).to.equal(true)
        })
    })

    describe("#DefaultReplayStrategy", () => {
        it("should use AllReplayStrategy by default", () => {
            // Mock data for testing
            const defaultOptions = DefaultReplayStrategy

            // Test messages
            const message1 = { Msg: { From: "address1" } } as Message
            const message2 = { Msg: { From: "address2" } } as Message

            // Assertions
            expect(defaultOptions.replay).to.equal(true)
            expect(
                defaultOptions.replayStrategy!.shouldReplay(message1)
            ).to.equal(true)
            expect(
                defaultOptions.replayStrategy!.shouldReplay(message2)
            ).to.equal(true)
        })
    })
})
