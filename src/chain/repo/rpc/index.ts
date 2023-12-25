/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import {
    withRequestMethod,
    RPCResponse,
    FilecoinRPCEngine,
} from "@unipackage/net"
import { Message } from "../../../basic/message/types"
import { BlockMessages } from "../../../basic/block/types"
import { Tipset } from "../../../basic/tipset/types"
import { CidProperty } from "../../../basic/cid/types"

/**
 * Interface representing the RPC methods for the Filecoin chain.
 */
interface ChainFilecoinOriginRPC {
    ChainHead(): Promise<RPCResponse<Tipset>>
    ChainGetTipSetByHeight(
        height: number,
        cids: Array<CidProperty>
    ): Promise<RPCResponse<Tipset>>
    ChainGetBlockMessages(...params: any[]): Promise<RPCResponse<BlockMessages>>
    StateReplay(...params: any[]): Promise<RPCResponse<Message>>
}

/**
 * Decorator to add request methods to the ChainFilecoinOriginRPC class.
 */
@withRequestMethod([
    "ChainHead",
    "ChainGetTipSetByHeight",
    "ChainGetBlockMessages",
    "StateReplay",
])
class ChainFilecoinOriginRPC extends FilecoinRPCEngine {}

/**
 * Extended class with additional methods and modifications for handling Filecoin chain RPC.
 */
export class ChainFilecoinRPC extends ChainFilecoinOriginRPC {
    /**
     * Retrieves chain head tipset
     * @returns A promise resolving to the RPC response containing tipset.
     */
    public async ChainHead(): Promise<RPCResponse<Tipset>> {
        const res: any = await super.ChainHead()
        if (res.ok && res.data) {
            res.data = new Tipset(res.data)
        }
        return res
    }

    /**
     * Retrieves chain head tipset
     * @param height- The .height
     * @returns A promise resolving to the RPC response containing tipset.
     */
    public async ChainGetTipSetByHeight(
        height: number,
        cids: Array<CidProperty>
    ): Promise<RPCResponse<Tipset>> {
        const res: any = await super.ChainGetTipSetByHeight(height, cids)
        if (res.ok && res.data) {
            res.data = new Tipset(res.data)
        }
        return res
    }

    /**
     * Retrieves block messages for a given tipset and block CID.
     * @param tipset - The tipset.
     * @param blockCid - The CID of the block.
     * @returns A promise resolving to the RPC response containing block messages.
     */
    public async ChainGetBlockMessages(
        tipset: Tipset,
        blockCid: CidProperty
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

    /**
     * Replays a state for a given tipset and message CID.
     * @param tipset - The tipset.
     * @param msgCid - The CID of the message.
     * @returns A promise resolving to the RPC response containing the replayed message.
     */
    public async StateReplay(
        tipset: Tipset,
        msgCid: CidProperty
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
