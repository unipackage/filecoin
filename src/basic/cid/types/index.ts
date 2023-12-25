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

import { CID } from "multiformats/cid"
import { Hash } from "../../hash/types"

export interface CidProperty {
    "/": string
}

/**
 * Wrapper class for CID functionality.
 */
export class Cid {
    CID: CID

    /**
     * Creates an instance of the Cid class.
     * @param cid - String representation of the CID.
     */
    constructor(cid: string | CidProperty) {
        // Parse the string representation of CID and store it
        if (typeof cid === "string") {
            this.CID = CID.parse(cid)
        } else {
            this.CID = CID.parse(cid["/"])
        }
    }

    /**
     * Gets the hash component of the CID.
     * @returns Uint8Array representing the hash of the CID.
     */
    toHash(): Hash {
        return new Hash(this.CID.multihash.digest)
    }
}
