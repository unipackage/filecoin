import {
    registerMethod,
    RPCResponse,
    RPCOptions,
    RPC,
    FilecoinRPCEngine,
} from "@unipackage/net"
import { MessageProperties } from "../../../message/types"
import { BlockMessagesProperties } from "../../../block/types"
import { TipsetProperties } from "../../../tipset/types"
import { Cid } from "../../../cid/types"
import { LotusRpcEngineConfig } from "@glif/filecoin-rpc-client"

class ChainRPC extends RPC {}

interface ChainFilecoinOriginRPC {
    ChainHead(): Promise<RPCResponse<TipsetProperties>>
    ChainGetTipSetByHeight(
        ...parmas: any[]
    ): Promise<RPCResponse<TipsetProperties>>
    ChainGetBlockMessages(
        ...parmas: any[]
    ): Promise<RPCResponse<BlockMessagesProperties>>
    StateReplay(...parmas: any[]): Promise<RPCResponse<MessageProperties>>
}

@registerMethod([
    "ChainHead",
    "ChainGetTipSetByHeight",
    "ChainGetBlockMessages",
    "StateReplay",
])
class ChainFilecoinOriginRPC extends ChainRPC {
    constructor(config: LotusRpcEngineConfig, defaultOptions?: RPCOptions) {
        super(new FilecoinRPCEngine(config, defaultOptions))
    }
}

export class ChainFilecoinRPC extends ChainFilecoinOriginRPC {
    public async ChainGetBlockMessages(
        tipset: TipsetProperties,
        blockCid: Cid
    ): Promise<RPCResponse<BlockMessagesProperties>> {
        let res = await super.ChainGetBlockMessages(blockCid)
        if (res.ok && res.data) {
            res.data = {
                ...res.data,
                BlockCid: blockCid,
                Height: tipset.Height,
            }
        }
        return res
    }

    public async StateReplay(
        tipset: TipsetProperties,
        msgCid: Cid
    ): Promise<RPCResponse<MessageProperties>> {
        let res = await super.StateReplay(tipset.Cids, msgCid, {
            resultRules: { acceptUndefined: true },
        })
        if (res.ok && res.data) {
            const { MsgCid, Msg, MsgRct, GasCost } = res.data
            res.data = {
                Height: tipset.Height,
                Replayed: true,
                MsgCid,
                Msg,
                MsgRct,
                GasCost,
            } as MessageProperties
        }
        return res
    }
}
