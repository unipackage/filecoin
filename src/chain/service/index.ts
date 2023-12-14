import { Result } from "@unipackage/utils"
import { Message } from "../../basic/message/types"
import { Tipset } from "../../basic/tipset/types"
import { Chain } from "../types"
import {
    BlockMongoDatastore,
    MessageMongoDatastore,
    TipsetMongoDatastore,
} from "../repo/datastore"
import { ChainFilecoinRPC } from "../repo/rpc"
import {
    GetBlockMessagesesByTipset,
    GetRepalyedMessagesByblockMessageses,
} from "./utils"
import { BlockMessagesToMessages } from "../../basic/block/utils"
import { ReplayStrategyOptions } from "./replayStrategy"

interface IChainServiceOptions {
    rpc: ChainFilecoinRPC
    messageDs: MessageMongoDatastore
    blockMessagesDs: BlockMongoDatastore
    tipsetDs: TipsetMongoDatastore
    replayStrategyOptions?: ReplayStrategyOptions
}

interface IChainService {
    GetChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<Chain>>
    SaveChainInfo(chainInfo: Chain): Promise<Result<void>>
    GetAndSaveChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<void>>
}

export class ChainService implements IChainService {
    private rpc: ChainFilecoinRPC
    private messageDs: MessageMongoDatastore
    private blockMessagesDs: BlockMongoDatastore
    private tipsetDs: TipsetMongoDatastore
    private replayStrategyOptions: ReplayStrategyOptions

    constructor(options: IChainServiceOptions) {
        this.rpc = options.rpc
        this.messageDs = options.messageDs
        this.blockMessagesDs = options.blockMessagesDs
        this.tipsetDs = options.tipsetDs
        this.replayStrategyOptions = options.replayStrategyOptions
            ? options.replayStrategyOptions
            : {}
    }

    public async GetChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<Chain>> {
        try {
            const chainHeadRes = await this.rpc.ChainHead()
            if (!chainHeadRes.ok || !chainHeadRes.data)
                return { ok: false, error: chainHeadRes.error }
            const chainHead = new Tipset(chainHeadRes.data)

            const tipsetRes = await this.rpc.ChainGetTipSetByHeight(
                height,
                chainHead.Cids
            )
            if (!tipsetRes.ok || !tipsetRes.data)
                return { ok: false, error: tipsetRes.error }
            const tipset = tipsetRes.data

            const blockMessagesArrayRes = await GetBlockMessagesesByTipset(
                this.rpc,
                tipset
            )
            if (!blockMessagesArrayRes.ok || !blockMessagesArrayRes.data)
                return { ok: false, error: blockMessagesArrayRes.error }
            const blockMessagesArray = blockMessagesArrayRes.data
            const unreplayMessages = BlockMessagesToMessages(
                blockMessagesArray,
                tipset
            )

            const replayedMessagesRes =
                await GetRepalyedMessagesByblockMessageses(
                    this.rpc,
                    unreplayMessages,
                    tipset,
                    replayStrategyOptions
                        ? replayStrategyOptions
                        : this.replayStrategyOptions
                )
            if (!replayedMessagesRes.ok || !replayedMessagesRes.data)
                return { ok: false, error: replayedMessagesRes.error }
            const messages = replayedMessagesRes.data

            return {
                ok: true,
                data: new Chain({
                    tipset,
                    blockMessagesArray,
                    messages,
                }),
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }

    async SaveChainInfo(chainInfo: Chain): Promise<Result<void>> {
        const errors: any[] = []
        let result: Result<void> = {
            ok: false,
            data: undefined,
            error: undefined,
        }
        try {
            //connect TODO
            const msgConnect = await this.messageDs.connect()
            if (!msgConnect.ok) return { ok: false, error: msgConnect.error }
            const bmConnect = await this.blockMessagesDs.connect()
            if (!bmConnect.ok) return { ok: false, error: bmConnect.error }
            const tsConnect = await this.tipsetDs.connect()
            if (!tsConnect.ok) return { ok: false, error: tsConnect.error }

            const msgDoResults = await Promise.all(
                chainInfo.messages.map(
                    async (message: Message) =>
                        await this.messageDs.CreateOrupdateByUniqueIndexes(
                            message
                        )
                )
            )
            for (const msgDoResult of msgDoResults) {
                !msgDoResult.ok && errors.push(msgDoResult.error)
            }
            if (errors.length > 0) return { ok: false, error: errors }

            const blcokMessagesDoResults = await Promise.all(
                chainInfo.blockMessagesArray.map(
                    async (blockMessages) =>
                        await this.blockMessagesDs.CreateOrupdateByUniqueIndexes(
                            blockMessages
                        )
                )
            )
            for (const blcokMessagesDoResult of blcokMessagesDoResults) {
                !blcokMessagesDoResult.ok &&
                    errors.push(blcokMessagesDoResult.error)
            }
            if (errors.length > 0) return { ok: false, error: errors }

            const tipsetDoResult =
                await this.tipsetDs.CreateOrupdateByUniqueIndexes(
                    chainInfo.tipset
                )
            if (!tipsetDoResult.ok)
                return { ok: false, error: tipsetDoResult.error }
            /* 
                        await this.tipsetDs.disconnect()
                        await this.blockMessagesDs.disconnect()
                        await this.messageDs.disconnect()
             */
            result.ok = true
        } catch (error) {
            result.error = error
            return result
        }

        return result
    }

    async GetAndSaveChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<void>> {
        try {
            const chainInfoRes = await this.GetChainInfoByHeight(
                height,
                replayStrategyOptions
            )
            if (!chainInfoRes.ok || !chainInfoRes.data)
                return { ok: false, error: chainInfoRes.error }
            const res = await this.SaveChainInfo(chainInfoRes.data)
            if (!res.ok) return { ok: false, error: res.error }
            return { ok: true }
        } catch (error) {
            return { ok: false, error: error }
        }
    }
}
