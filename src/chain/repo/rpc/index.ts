import { withRequestMethod, RPCResponse, FilecoinRPC } from "@unipackage/net"
import { Message } from "../../../basic/message/types"
import { BlockMessages } from "../../../basic/block/types"
import { Tipset } from "../../../basic/tipset/types"
import { Cid } from "../../../basic/cid/types"

interface ChainFilecoinOriginRPC {
    ChainHead(): Promise<RPCResponse<Tipset>>
    ChainGetTipSetByHeight(...parmas: any[]): Promise<RPCResponse<Tipset>>
    ChainGetBlockMessages(...parmas: any[]): Promise<RPCResponse<BlockMessages>>
    StateReplay(...parmas: any[]): Promise<RPCResponse<Message>>
}

@withRequestMethod([
    "ChainHead",
    "ChainGetTipSetByHeight",
    "ChainGetBlockMessages",
    "StateReplay",
])
class ChainFilecoinOriginRPC extends FilecoinRPC {}

export class ChainFilecoinRPC extends ChainFilecoinOriginRPC {
    public async ChainGetBlockMessages(
        tipset: Tipset,
        blockCid: Cid
    ): Promise<RPCResponse<BlockMessages>> {
        let res = await super.ChainGetBlockMessages(blockCid)
        if (res.ok && res.data) {
            res.data = new BlockMessages({
                ...res.data,
                BlockCid: blockCid,
                Height: tipset.Height,
            })
        }
        return res
    }

    public async StateReplay(
        tipset: Tipset,
        msgCid: Cid
    ): Promise<RPCResponse<Message>> {
        let res = await super.StateReplay(tipset.Cids, msgCid, {
            resultRules: { acceptUndefined: true },
        })
        if (res.ok && res.data) {
            const { MsgCid, Msg, MsgRct, GasCost } = res.data
            res.data = new Message({
                Height: tipset.Height,
                Replayed: true,
                MsgCid,
                Msg,
                MsgRct,
                GasCost,
            })
        }
        return res
    }
}
