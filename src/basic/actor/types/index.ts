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

import { Cid } from "../../cid/types"
import { Balance } from "../../balance/types"
import { Address } from "../../address/types"
import { Entity } from "@unipackage/ddd"
import {
    ActorCode,
    ActorName,
    getActorName as glifgetActorName,
    NetworkName,
} from "@glif/filecoin-actor-utils"

/**
 * Interface representing the properties of an Actor.
 */
export interface Actor {
    Code: ActorCode
    Head: Cid
    Nonce: number
    Balance: Balance
    Address: Address
}

/**
 * Class representing an Actor entity, extending the Entity class.
 */
export class Actor extends Entity<Actor> {
    /**
     * Gets the ActorName based on the Actor's Code and NetworkName.
     * @param networkName - The NetworkName for which to get the ActorName.
     * @returns The ActorName or null if not found.
     */
    getActorName(networkName: NetworkName): ActorName | null {
        return glifgetActorName(this.Code, networkName)
    }
}
