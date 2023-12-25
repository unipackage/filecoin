import { assert } from "chai"
import { EnhanceNumber } from "@unipackage/utils"
import { Balance, MarketBalance } from "../../src/basic/balance/types"
import { describe, it } from "mocha"

describe("Balance", () => {
    let balance: Balance

    beforeEach(() => {
        balance = new Balance(10, "fil")
    })

    describe("#toEnhanceNumberFil", () => {
        it("should convert balance to EnhanceNumber in the specified denomination", () => {
            const enhanceNumber = balance.toEnhanceNumberFil("attofil")
            assert.instanceOf(enhanceNumber, EnhanceNumber)

            assert.deepStrictEqual(
                enhanceNumber.valueOf(),
                10000000000000000000
            )
        })
    })
})

describe("MarketBalance", () => {
    let marketBalance: MarketBalance

    beforeEach(() => {
        marketBalance = new MarketBalance({
            Escrow: new Balance(10, "fil"),
            Locked: new Balance(10, "fil"),
        })
    })
    describe("#MarketBalance", () => {
        it("MarketBalance instance test", () => {
            assert.instanceOf(marketBalance, MarketBalance)
        })
    })
})
