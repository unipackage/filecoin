import { assert } from "chai"
import { describe, it } from "mocha"
import { Hash } from "../../src/basic/hash/types"

describe("Hash", () => {
    const hash = new Hash(
        "0x89ae145002eb02c1af11eabfafc940fffca3ab96bcff69c64db2ece1272c9cb8"
    )

    describe("#Hash toCid", () => {
        it("hash to Cid0/1 test", () => {
            const cid = hash.toCid()
            assert.deepStrictEqual(
                cid.CID.toV0().toString(),
                "QmXc6XABTWTd7G9MxG4wWtYEj3ZZeKpnmN5QyPnUJVZ8r3"
            )
            assert.deepStrictEqual(
                cid.CID.toV1().toString(),
                "bafybeiejvykfaaxlala26epkx6x4sqh77sr2xfv475u4mtns5tqsole4xa"
            )
        })
    })

    describe("#hash toString", () => {
        it("should convert the hash to a string", () => {
            const hashString = hash.toString()
            assert.deepStrictEqual(
                hashString,
                "0x89ae145002eb02c1af11eabfafc940fffca3ab96bcff69c64db2ece1272c9cb8"
            )
        })
    })

    describe("#hash toUint8Array", () => {
        it("should return the hash as a Uint8Array", () => {
            const hashUint8Array = hash.toUint8Array()
            assert.instanceOf(hashUint8Array, Uint8Array)
            assert.deepStrictEqual(
                hashUint8Array,
                new Uint8Array([
                    137, 174, 20, 80, 2, 235, 2, 193, 175, 17, 234, 191, 175,
                    201, 64, 255, 252, 163, 171, 150, 188, 255, 105, 198, 77,
                    178, 236, 225, 39, 44, 156, 184,
                ])
            )
        })
    })
})
