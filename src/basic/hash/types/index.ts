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
// import { digest } from "multiformats/basics"
import { CID } from "multiformats/cid"
// import * as json from "multiformats/codecs/json"

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
            const encoder = new TextEncoder()
            this.hash = encoder.encode(hash)
        } else {
            this.hash = hash
        }
    }

    /**
     * Converts the hash to a CID (Content Identifier) using the CID version 0.
     * @returns The CID version 0 representation of the hash.
     */
    toCidV0(): Cid {
        // return new Cid(CID.createV0(digest.create(18, this.hash)).toString())
        return new Cid("")
    }

    /**
     * Converts the hash to a CID (Content Identifier) using the CID version 1.
     * @returns The CID version 1 representation of the hash.
     */
    toCidV1(): Cid {
        return new Cid(
            // CID.createV1(json.code, digest.create(0x55, this.hash)).toString()
            ""
        )
    }

    /**
     * Converts the hash to a string.
     * @returns The string representation of the hash.
     */
    toString(): string {
        const decoder = new TextDecoder("utf-8")
        return decoder.decode(this.hash)
    }

    /**
     * Returns the hash as a Uint8Array.
     * @returns The hash as a Uint8Array.
     */
    toUint8Array(): Uint8Array {
        return this.hash
    }
}
