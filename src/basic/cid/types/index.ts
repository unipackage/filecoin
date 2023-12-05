import { CID } from "multiformats/cid"

export interface ICidUtils {
    isCidEqual(sourceCid: Cid, targetCid: Cid): boolean
}

export class Cid {
    private CID: CID
    constructor(cid: string) {
        this.CID = CID.parse(cid)
    }

    toHash(): Uint8Array {
        return this.CID.multihash.digest
    }
}
