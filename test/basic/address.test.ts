import { expect } from "chai"
import { describe, it } from "mocha"
import { Address } from "../../src/basic/address/types"

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

describe("Address", () => {
    describe("#Address test", () => {
        it("should instantiate with string", () => {
            const addressStr = "f1m2swr32yrlouzs7ijui3jttwgc6lxa5n5sookhi"
            const address = new Address(addressStr)

            expect(address).to.be.not.be.undefined
            expect(address.toString()).to.equal(addressStr)
        })

        it("should get the ID address", () => {
            const addressStr = "f01234"
            const address = new Address(addressStr)
            const result = address.getIdAddress()
            expect(result).to.be.equal(addressStr)
        })

        it("should set and get the ID address", () => {
            const addressStr = "f1m2swr32yrlouzs7ijui3jttwgc6lxa5n5sookhi"
            const newIdAddress = "f01111"
            const address = new Address(addressStr)

            // Set the ID address
            const setResult = address.setIdAddress(newIdAddress)
            expect(setResult.ok).to.be.true

            // Get the ID address
            const getResult = address.getIdAddress()
            expect(getResult).to.be.equal(newIdAddress)
        })

        it("should not set ID address if already set", () => {
            const addressStr = "f1m2swr32yrlouzs7ijui3jttwgc6lxa5n5sookhi"
            const newIdAddress = "f01111"
            const address = new Address(addressStr)
            // Set the ID address initially
            const firstSetResult = address.setIdAddress(newIdAddress)
            expect(firstSetResult.ok).to.be.true

            // Try setting again
            const secondSetResult = address.setIdAddress("f01112")
            expect(secondSetResult.ok).to.be.false
            expect(secondSetResult.error).to.be.equal(
                "Id Address is already set"
            )
        })
    })
})
