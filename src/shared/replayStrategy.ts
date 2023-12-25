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

import { Message } from "../basic/message/types"

/**
 * Interface for defining a replay strategy.
 */
export interface ReplayStrategy {
    /**
     * Determines whether a message should be replayed based on the implemented strategy.
     * @param message - The message to evaluate.
     * @returns A boolean indicating whether the message should be replayed.
     */
    shouldReplay(message: Message): boolean
}

/**
 * Options for specifying replay behavior and strategy.
 */
export interface ReplayStrategyOptions {
    replay?: boolean
    replayStrategy?: ReplayStrategy
}

/**
 * Implementation of a replay strategy based on a list of specified addresses.
 */
export class AddressesFilterReplayStrategy implements ReplayStrategy {
    private addresses: string[]

    /**
     * Constructs an instance of AddressesFilterReplayStrategy.
     * @param addresses - An array of addresses to include in the replay filter.
     */
    constructor(addresses: string[]) {
        this.addresses = addresses
    }

    /**
     * Determines whether a message should be replayed based on the sender or receiver address.
     * @param message - The message to evaluate.
     * @returns A boolean indicating whether the message should be replayed.
     */
    shouldReplay(message: Message): boolean {
        return (
            this.addresses.includes(message.Msg.From) ||
            this.addresses.includes(message.Msg.To)
        )
    }
}

/**
 * Implementation of a replay strategy that replays all messages.
 */
export class AllReplayStrategy implements ReplayStrategy {
    /**
     * Determines whether all messages should be replayed.
     * @param message - The message to evaluate.
     * @returns A boolean indicating that all messages should be replayed.
     */
    shouldReplay(message: Message): boolean {
        return true
    }
}

/**
 * Default replay strategy options, replays all messages by default.
 */
export const DefaultReplayStrategy: ReplayStrategyOptions = {
    replay: true,
    replayStrategy: new AllReplayStrategy(),
}
