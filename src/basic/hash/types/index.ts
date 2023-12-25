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
import { digest } from "multiformats/basics"
import { CID } from "multiformats/cid"

/**
 * Class representing a hash.
 */
export class Hash {
    private hash: Uint8Array

    /**
     * Creates an instance of the Hash class.
     * @param hash - The hash value as a Uint8Array or a string.
     */
    constructor(hash: Uint8Array | string) {
        if (typeof hash === "string") {
            this.hash = hexToBinaryHash(hash)
        } else {
            this.hash = hash
        }
    }

    /**
     * Converts the hash to a CID (Content Identifier) using the CID version 0.
     * @returns The CID version 0 representation of the hash.
     */
    toCid(): Cid {
        return new Cid(
            CID.createV0(digest.create(0x12, this.hash)).toV1().toString()
        )
    }

    /**
     * Converts the hash to a string.
     * @returns The string representation of the hash.
     */
    toString(): string {
        return binaryHashToHex(this.hash)
    }

    /**
     * Returns the hash as a Uint8Array.
     * @returns The hash as a Uint8Array.
     */
    toUint8Array(): Uint8Array {
        return this.hash
    }
}

/**
 * Converts a binary hash to a hexadecimal string.
 * @param binaryHash - The binary hash as a Uint8Array.
 * @returns The hexadecimal string representation of the hash.
 */
function binaryHashToHex(binaryHash: Uint8Array): string {
    const hexArray = Array.from(binaryHash).map((byte) =>
        byte.toString(16).padStart(2, "0")
    )

    return "0x" + hexArray.join("")
}

/**
 * Converts a hexadecimal string (with or without '0x' prefix) to a binary hash (Uint8Array).
 * @param hexString - The hexadecimal string.
 * @returns The binary hash as a Uint8Array.
 */
function hexToBinaryHash(hexString: string): Uint8Array {
    // Remove '0x' prefix if present
    hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString

    const length = hexString.length / 2
    const binaryHash = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
        binaryHash[i] = parseInt(hexString.substr(i * 2, 2), 16)
    }

    return binaryHash
}
