import { assert } from "chai"
import { Cid } from "../../src/basic/cid/types"
import { describe, it } from "mocha"

describe("Cid", () => {
    const cidString = "QmXc6XABTWTd7G9MxG4wWtYEj3ZZeKpnmN5QyPnUJVZ8r3"
    const cid = new Cid(cidString)

    describe("#Cid test", () => {
        it("should to CIDV0/v1 ok", () => {
            assert.deepStrictEqual(
                cid.CID.toV0().toString(),
                "QmXc6XABTWTd7G9MxG4wWtYEj3ZZeKpnmN5QyPnUJVZ8r3"
            )

            assert.deepStrictEqual(
                cid.CID.toV1().toString(),
                "bafybeiejvykfaaxlala26epkx6x4sqh77sr2xfv475u4mtns5tqsole4xa"
            )
        })

        it("should get the hash ok", () => {
            const hash = cid.toHash()
            assert.deepStrictEqual(
                hash.toUint8Array(),
                new Uint8Array([
                    137, 174, 20, 80, 2, 235, 2, 193, 175, 17, 234, 191, 175,
                    201, 64, 255, 252, 163, 171, 150, 188, 255, 105, 198, 77,
                    178, 236, 225, 39, 44, 156, 184,
                ])
            )
            assert.deepStrictEqual(
                hash.toString(),
                "0x89ae145002eb02c1af11eabfafc940fffca3ab96bcff69c64db2ece1272c9cb8"
            )
        })
    })
})
