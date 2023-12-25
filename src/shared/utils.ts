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

import { Result } from "@unipackage/utils"
import { Message } from "../basic/message/types"
import { CidProperty } from "../basic/cid/types"
import { BlockMessages } from "../basic/block/types"
import { Tipset } from "../basic/tipset/types"
import { ReplayStrategy, DefaultReplayStrategy } from "./replayStrategy"
import { ChainFilecoinRPC } from "../chain/repo/rpc"

/**
 * Retrieves block messages for each block in a tipset.
 * @param rpc - The ChainFilecoinRPC instance to use for retrieving block messages.
 * @param tipset - The tipset for which to fetch block messages.
 * @returns A Promise that resolves to a Result containing the array of BlockMessages or an error.
 */
export async function GetBlockMessagesesByTipset(
    rpc: ChainFilecoinRPC,
    tipset: Tipset
): Promise<Result<BlockMessages[]>> {
    const errors: any[] = []
    const blockMessagesArray: BlockMessages[] = []

    const blockMessagesArrayRes = await Promise.all(
        tipset.Cids.map(
            async (blockCid: CidProperty) =>
                await rpc.ChainGetBlockMessages(tipset, blockCid)
        )
    )
    for (const blockMessages of blockMessagesArrayRes) {
        if (blockMessages.ok && blockMessages.data) {
            blockMessagesArray.push(blockMessages.data)
        } else {
            errors.push(blockMessages.error)
        }
    }

    if (errors.length > 0) {
        return {
            ok: false,
            error: errors,
        }
    }
    return {
        ok: true,
        data: blockMessagesArray,
    }
}

/**
 * Retrieves replayed messages based on the provided options and strategy.
 * @param rpc - The ChainFilecoinRPC instance to use for replaying messages.
 * @param messages - The array of messages to process.
 * @param tipset - The tipset associated with the messages.
 * @param options - Options for replaying messages, including a replay flag and replay strategy.
 * @returns A Promise that resolves to a Result containing the array of replayed messages or an error.
 */
export async function GetRepalyedMessages(
    rpc: ChainFilecoinRPC,
    messages: Message[],
    tipset: Tipset,
    options?: {
        replay?: boolean
        replayStrategy?: ReplayStrategy
    }
): Promise<Result<Message[]> | Result<undefined>> {
    const filteredMessages: Message[] = []
    const errors: any[] = []

    options = {
        ...DefaultReplayStrategy,
        ...options,
    }

    if (options.replay) {
        const replayPromiseArray: Promise<Result<Message>>[] = []

        for (const message of messages) {
            if (
                options.replayStrategy &&
                options.replayStrategy.shouldReplay(message)
            ) {
                replayPromiseArray.push(rpc.StateReplay(tipset, message.MsgCid))
            } else {
                filteredMessages.push(message)
            }
        }

        const replayRes = await Promise.all(replayPromiseArray)

        for (const relayMessage of replayRes) {
            if (relayMessage.ok) {
                // because StateReplay accepts undefined result
                relayMessage.data && filteredMessages.push(relayMessage.data)
            } else {
                errors.push(relayMessage.error)
            }
        }
    } else {
        filteredMessages.push(...messages)
    }

    if (errors.length > 0) {
        return {
            ok: false,
            error: errors,
        }
    }

    return {
        ok: true,
        data: filteredMessages,
    }
}
