import { Result } from "@unipackage/utils"
import { IEVM } from "@unipackage/net"
import { Message } from "../../message/types"
import { ContractMessage } from "../types"

export class ContractMessageDecoder {
    private evm: IEVM
    constructor(evm: IEVM) {
        this.evm = evm
    }

    decode(msg: Message): Result<ContractMessage> {
        //@ts-ignore
        //TODO
        const decodeInputRes = this.evm.decodeTxInput(msg.Msg.Params)
        if (!decodeInputRes.ok && !decodeInputRes.data) {
            return { ok: false, error: decodeInputRes.error }
        }
        if (!msg.MsgRct) {
            return { ok: false, error: "Missing MsgRct!" }
        }

        const dsmsg: ContractMessage = {
            cid: msg.MsgCid,
            height: msg.Height,
            timestamp: "",
            from: msg.Msg.From,
            to: msg.Msg.To,
            method: decodeInputRes.data!.method,
            params: decodeInputRes.data!.params,
            status: msg.MsgRct!.ExitCode,
        }

        return {
            ok: true,
            data: dsmsg,
        }
    }
}
