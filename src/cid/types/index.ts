export interface Cid {
    "/": string
}

export interface ICidUtils {
    isCidEqual(sourceCid: Cid, targetCid: Cid): boolean
}
