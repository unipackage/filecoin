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

import { describe, it } from "mocha"
import { assert } from "chai"
import { Address } from "../../src/basic/address/types"
import { Balance, MarketBalance } from "../../src/basic/balance/types"
import { Account } from "../../src/basic/account/types"

describe("Account", () => {
    let account: Account

    beforeEach(() => {
        const address = "f1m2swr32yrlouzs7ijui3jttwgc6lxa5n5sookhi"
        const balance = new Balance(100, "fil")
        const marketBalance = new MarketBalance({
            Escrow: new Balance(50, "fil"),
            Locked: new Balance(25, "fil"),
        })

        account = new Account({
            Address: new Address(address),
            Balance: balance,
            Marketbalance: marketBalance,
        })
    })

    describe("#marketEscrowBalance", () => {
        it("should calculate market escrow balance correctly", () => {
            const escrowBalance = account.marketEscrowBalance("fil")
            assert.isDefined(escrowBalance)
            assert.equal(escrowBalance.toNumber(), 50)
        })
    })

    describe("#marketLockedBalance", () => {
        it("should calculate market locked balance correctly", () => {
            const lockedBalance = account.marketLockedBalance("fil")
            assert.isDefined(lockedBalance)
            assert.equal(lockedBalance.toNumber(), 25)
        })
    })

    describe("#basicBalance", () => {
        it("should calculate basic balance correctly", () => {
            const basicBalance = account.basicBalance("fil")
            assert.isDefined(basicBalance)
            assert.equal(basicBalance.toNumber(), 100)
        })
    })

    describe("#totalBalance", () => {
        it("should calculate total balance correctly", () => {
            const totalBalance = account.totalBalance("fil")
            assert.isDefined(totalBalance)
            assert.equal(totalBalance.toNumber(), 175)
        })
    })

    describe("#availableBalance", () => {
        it("should calculate available balance correctly", () => {
            const availableBalance = account.availableBalance("fil")
            assert.isDefined(availableBalance)
            assert.equal(availableBalance.toNumber(), 150)
        })
    })
})
