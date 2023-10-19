import { fromJSON, CID } from "multiformats/cid"
export interface ICidUtils {
    isCidEqual(sourceCid: Cid, targetCid: Cid): boolean
}
export interface CidProperties {
    "/": string
}

export class Cid {
    private CID: CID
    constructor(cid: CidProperties) {
        this.CID = fromJSON(cid)
    }

    toHash(): Uint8Array {
        return this.CID.multihash.digest
    }
}
