import { Result } from "@unipackage/utils"
import { Message } from "../../basic/message/types"
import { Cid } from "../../basic/cid/types"
import { BlockMessages } from "../../basic/block/types"
import { Tipset } from "../../basic/tipset/types"
import { ReplayStrategy, DefaultReplayStrategy } from "./replayStrategy"
import { ChainFilecoinRPC } from "../repo/rpc"

export async function GetBlockMessagesesByTipset(
    rpc: ChainFilecoinRPC,
    tipset: Tipset
): Promise<Result<BlockMessages[]>> {
    const errors: any[] = []
    const blockMessagesArray: BlockMessages[] = []

    const blockMessagesArrayRes = await Promise.all(
        tipset.Cids.map(
            async (blockCid: Cid) =>
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

export async function GetRepalyedMessagesByblockMessageses(
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
                //because StateReplay accecpt undefined result
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
