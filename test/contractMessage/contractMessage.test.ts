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
import { ContractMessage } from "../../src/contractMessage/types" // Replace with the actual path to your TypeScript file

describe("ContractMessage Entity", () => {
    it("should create a valid ContractMessage entity", () => {
        const contractMessageData = new ContractMessage({
            cid: { "/": "" },
            height: 1,
            timestamp: "2023-01-01T12:00:00Z",
            from: "senderAddress",
            to: "recipientAddress",
            method: "transfer",
            params: {
                /* Add parameter properties */
            },
            status: "0",
            return: 0x0,
        })

        const contractMessageEntity = new ContractMessage(contractMessageData)

        expect(contractMessageEntity).to.be.an.instanceOf(ContractMessage)
    })
})
