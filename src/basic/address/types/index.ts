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
    Address as GlifAddress,
    Protocol,
    newFromString,
} from "@glif/filecoin-address"
import { Result } from "@unipackage/utils"

/**
 * Customized Address class that extends the GlifAddress class.
 */
export class Address extends GlifAddress {
    private idAddress: string | undefined

    /**
     * Constructor for the Address class.
     * @param address- The address string.
     */
    constructor(address: string) {
        super(newFromString(address).bytes)
        // Initialize the idAddress property based on the Protocol
        this.idAddress =
            super.protocol() === Protocol.ID ? this.toString() : undefined
    }

    /**
     * Gets the ID address if set.
     * @returns A Result containing the ID address if set, or an error message if not set.
     */
    getIdAddress(): string | undefined {
        return this.idAddress
    }

    /**
     * Sets the ID address.
     * @param idAddress - The ID address to set.
     * @returns A Result indicating success or failure, with an optional error message.
     */
    setIdAddress(idAddress: string): Result<void> {
        if (!this.idAddress) {
            // If the ID address is not already set, update it
            this.idAddress = idAddress
            return {
                ok: true,
            }
        }
        return {
            ok: false,
            error: "Id Address is already set",
        }
    }
}
