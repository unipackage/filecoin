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
    CoinType,
} from "@glif/filecoin-address"
import { Result } from "@unipackage/utils"

/**
 * Customized Address class that extends the GlifAddress class.
 */
export class Address extends GlifAddress {
    private idAddress: string

    /**
     * Constructor for the Address class.
     * @param bytes - The address bytes as a Uint8Array or a string.
     * @param coinType - The optional coin type.
     */
    constructor(bytes: Uint8Array | string, coinType?: CoinType) {
        if (typeof bytes === "string") {
            // If the input is a string, encode it to bytes using TextEncoder
            const encoder = new TextEncoder()
            super(encoder.encode(bytes), coinType)
        } else {
            // If the input is already bytes, use it directly
            super(bytes, coinType)
        }
        // Initialize the idAddress property based on the Protocol
        this.idAddress = super.protocol() === Protocol.ID ? this.toString() : ""
    }

    /**
     * Gets the ID address if set.
     * @returns A Result containing the ID address if set, or an error message if not set.
     */
    getIdAddress(): Result<string> {
        return this.idAddress !== ""
            ? {
                  ok: true,
                  data: this.idAddress,
              }
            : {
                  ok: false,
                  error: "IdAddress not set",
              }
    }

    /**
     * Sets the ID address.
     * @param idAddress - The ID address to set.
     * @returns A Result indicating success or failure, with an optional error message.
     */
    setIdAddress(idAddress: string): Result<void> {
        if (this.idAddress !== "") {
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
