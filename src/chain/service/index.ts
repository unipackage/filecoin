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
import { Chain } from "../types"
import {
    BlockMongoDatastore,
    MessageMongoDatastore,
    TipsetMongoDatastore,
} from "../repo/datastore"
import { ChainFilecoinRPC } from "../repo/rpc"
import {
    GetBlockMessagesesByTipset,
    GetRepalyedMessages,
} from "../../shared/utils"
import { BlockMessagesToMessages } from "../../shared/blockMsgsToMsgs"
import { ReplayStrategyOptions } from "../../shared/replayStrategy"

export interface ChainServiceOptions {
    rpc: ChainFilecoinRPC
    messageDs: MessageMongoDatastore
    blockMessagesDs: BlockMongoDatastore
    tipsetDs: TipsetMongoDatastore
    replayStrategyOptions?: ReplayStrategyOptions
}

export interface ChainService {
    GetChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<Chain>>
    SaveChainInfo(chain: Chain): Promise<Result<void>>
    GetAndSaveChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<void>>
}

/**
 * Implementation of the chain service providing methods to retrieve, save, and process chain information.
 */
export class ChainService implements ChainService {
    private rpc: ChainFilecoinRPC
    private messageDs: MessageMongoDatastore
    private blockMessagesDs: BlockMongoDatastore
    private tipsetDs: TipsetMongoDatastore
    private replayStrategyOptions: ReplayStrategyOptions

    constructor(options: ChainServiceOptions) {
        this.rpc = options.rpc
        this.messageDs = options.messageDs
        this.blockMessagesDs = options.blockMessagesDs
        this.tipsetDs = options.tipsetDs
        this.replayStrategyOptions = options.replayStrategyOptions
            ? options.replayStrategyOptions
            : {}
    }

    /**
     * Retrieves chain information for a given height, including tipset, block messages, and replayed messages.
     * @param height - The height of the chain.
     * @param replayStrategyOptions - Options for replaying messages.
     * @returns A promise resolving to the result of the chain information retrieval.
     */
    public async GetChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<Chain>> {
        try {
            // Retrieve the chain head tipset.
            const chainHeadRes = await this.rpc.ChainHead()
            if (!chainHeadRes.ok || !chainHeadRes.data)
                return { ok: false, error: chainHeadRes.error }
            const chainHead = chainHeadRes.data

            // Retrieve the tipset at the specified height.
            const tipsetRes = await this.rpc.ChainGetTipSetByHeight(
                height,
                chainHead.Cids
            )
            if (!tipsetRes.ok || !tipsetRes.data)
                return { ok: false, error: tipsetRes.error }
            const tipset = tipsetRes.data

            // Retrieve block messages for the tipset.
            const blockMessagesArrayRes = await GetBlockMessagesesByTipset(
                this.rpc,
                tipset
            )
            if (!blockMessagesArrayRes.ok || !blockMessagesArrayRes.data)
                return { ok: false, error: blockMessagesArrayRes.error }
            const blockMessagesArray = blockMessagesArrayRes.data

            // Convert block messages to replayed messages.
            const unreplayMessages = BlockMessagesToMessages(
                blockMessagesArray,
                tipset
            )

            // Replay messages based on the specified strategy options.
            const replayedMessagesRes = await GetRepalyedMessages(
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

            // Return the resulting chain information.
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

    /**
     * Saves chain information to the data store.
     * @param chainInfo - The chain information to be saved.
     * @returns A promise resolving to the result of the save operation.
     */
    async SaveChainInfo(chain: Chain): Promise<Result<void>> {
        const errors: any[] = []
        let result: Result<void> = {
            ok: false,
            data: undefined,
            error: undefined,
        }
        try {
            // Connect to data stores.
            const msgConnect = await this.messageDs.connect()
            if (!msgConnect.ok) return { ok: false, error: msgConnect.error }
            const bmConnect = await this.blockMessagesDs.connect()
            if (!bmConnect.ok) return { ok: false, error: bmConnect.error }
            const tsConnect = await this.tipsetDs.connect()
            if (!tsConnect.ok) return { ok: false, error: tsConnect.error }

            // Save messages to the data store.
            const msgDoResults = await Promise.all(
                chain.messages.map(
                    async (message) =>
                        await this.messageDs.CreateOrupdateByUniqueIndexes(
                            message
                        )
                )
            )
            for (const msgDoResult of msgDoResults) {
                !msgDoResult.ok && errors.push(msgDoResult.error)
            }
            if (errors.length > 0) return { ok: false, error: errors }

            // Save block messages to the data store.
            const blcokMessagesDoResults = await Promise.all(
                chain.blockMessagesArray.map(
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

            // Save tipset to the data store.
            const tipsetDoResult =
                await this.tipsetDs.CreateOrupdateByUniqueIndexes(chain.tipset)
            if (!tipsetDoResult.ok)
                return { ok: false, error: tipsetDoResult.error }

            // Return success.
            result.ok = true
        } catch (error) {
            result.error = error
            return result
        } finally {
            // Disconnect from data stores.
            /* 
            await this.tipsetDs.disconnect();
            await this.blockMessagesDs.disconnect();
            await this.messageDs.disconnect();
            */
        }

        return result
    }

    /**
     * Retrieves and saves chain information for a given height.
     * @param height - The height of the chain.
     * @param replayStrategyOptions - Options for replaying messages.
     * @returns A promise resolving to the result of the operation.
     */
    async GetAndSaveChainInfoByHeight(
        height: number,
        replayStrategyOptions?: ReplayStrategyOptions
    ): Promise<Result<void>> {
        try {
            // Retrieve chain information.
            const chainInfoRes = await this.GetChainInfoByHeight(
                height,
                replayStrategyOptions
            )
            if (!chainInfoRes.ok || !chainInfoRes.data)
                return { ok: false, error: chainInfoRes.error }

            // Save chain information to the data store.
            const res = await this.SaveChainInfo(chainInfoRes.data)
            if (!res.ok) return { ok: false, error: res.error }

            return { ok: true }
        } catch (error) {
            return { ok: false, error: error }
        }
    }
}
