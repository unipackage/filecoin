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

import { Tipset } from "../basic/tipset/types"
import { BlockMessages } from "../basic/block/types"
import { BlsMessage, Message } from "../basic/message/types"

/**
 * Converts an array of BlockMessages to an array of Messages.
 * @param blockMessagesArray - Array of BlockMessages to convert.
 * @param tipset - Tipset object containing related Cids.
 * @returns Array of Messages.
 * @throws Error if a Block is not in the provided tipset.
 */
export function BlockMessagesToMessages(
    blockMessagesArray: BlockMessages[],
    tipset: Tipset
): Array<Message> {
    // Create a set of block Cids in the tipset for efficient lookup
    const blockCidsInTipset = new Set<string>(
        tipset.Cids.map((cid) => JSON.stringify(cid))
    )

    // Result array to store converted Messages
    const res: Array<Message> = []
    // Map to store unique Messages based on CID
    const messagesMap = new Map<string, BlsMessage>()

    // Iterate through each BlockMessages in the array
    for (const blockMessages of blockMessagesArray) {
        const blockCidString = JSON.stringify(blockMessages.BlockCid)
        // Check if the Block is in the provided tipset
        if (!blockCidsInTipset.has(blockCidString)) {
            throw new Error(
                `Block ${blockCidString} is not in the tipset with height ${tipset.Height}`
            )
        }
        // Iterate through each BlsMessage in the BlockMessages
        for (const bm of blockMessages.BlsMessages) {
            messagesMap.set(JSON.stringify(bm.CID), bm)
        }

        // Iterate through each SecpkMessage in the BlockMessages
        for (const sm of blockMessages.SecpkMessages) {
            // Create a new Message object and add it to the map
            const message = { ...sm.Message, CID: sm.CID }
            messagesMap.set(JSON.stringify(sm.CID), message)
        }
    }

    // Iterate through the messagesMap and add each Message to the result array
    messagesMap.forEach((value) => {
        res.push(
            new Message({
                Height: tipset.Height,
                Replayed: false,
                Msg: value,
                MsgCid: value.CID,
            })
        )
    })

    return res
}
