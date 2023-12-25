import { describe, it } from "mocha"
import { assert } from "chai"
import { Actor } from "../../src/basic/actor/types" // Update the path accordingly
import { Address } from "../../src/basic/address/types"
import { Balance } from "../../src/basic/balance/types"
import { ActorCode, NetworkName } from "@glif/filecoin-actor-utils"
import { Cid } from "../../src/basic/cid/types"

describe("Actor", () => {
    const actor = new Actor({
        Code: "bafk2bzaceafajceqwg5ybiz7xw6rxammuirkgtuv625gzaehsqfprm4bazjmk",
        Head: new Cid(
            "bafy2bzacecrzrir4qjgfkvcetnyljz26ewiq56e4jz2wljn5r53pozmtgh5ds"
        ),
        Nonce: 1,
        Balance: new Balance(10, "fil"),
        Address: new Address(
            "f3w53rtxgzmusu2yh4jxukylpmaaxy7zuvnem2z72udfjbry6mzutxyujm3hzr4h7bjawpunvq7wuq5nqpqoda"
        ),
    })

    describe("#getActorName", () => {
        it("should get ActorName based on Code and NetworkName", () => {
            const networkName: NetworkName = "mainnet"
            const actorName = actor.getActorName(networkName)
            assert.isNotNull(actorName)
            assert.deepStrictEqual(actorName, "multisig")
        })

        it("should return null for an unknown ActorCode", () => {
            const networkName: NetworkName = "mainnet"
            const unknownActorCode: ActorCode = "unknownActorCode"
            actor.Code = unknownActorCode
            const actorName = actor.getActorName(networkName)
            assert.isNull(actorName)
        })
    })
})
