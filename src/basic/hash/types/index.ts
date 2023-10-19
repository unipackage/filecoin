import { Cid } from "../../cid/types"
import { digest } from "multiformats/basics"
import { CID } from "multiformats/cid"
import * as json from "multiformats/codecs/json"

export class Hash {
    private hash: Uint8Array

    constructor(hash: Uint8Array | string) {
        if (typeof hash === "string") {
            const encoder = new TextEncoder()
            this.hash = encoder.encode(hash)
        } else {
            this.hash = hash
        }
    }

    toCidV0(): Cid {
        return new Cid(CID.createV0(digest.create(18, this.hash)).toJSON())
    }

    toCidV1(): Cid {
        return new Cid(
            CID.createV1(json.code, digest.create(0x55, this.hash)).toJSON()
        )
    }

    toString(): string {
        const decoder = new TextDecoder("utf-8")
        return decoder.decode(this.hash)
    }

    toUint8Array(): Uint8Array {
        return this.hash
    }
}
