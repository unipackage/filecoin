import { Cid } from "../../cid/types"

export interface ContractMessage {
    cid: Cid
    height: number
    timestamp: string
    from: string
    to: string
    method: string
    params: any
    status: number
}
