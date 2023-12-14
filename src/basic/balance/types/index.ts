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

import { FilecoinNumber, FilecoinDenomination } from "@glif/filecoin-number"
import { EnhanceNumber } from "@unipackage/utils"
import { Entity } from "@unipackage/ddd"

/**
 * Represents a balance class that extends the FilecoinNumber class.
 */
export class Balance extends FilecoinNumber {
    /**
     * Converts the balance to an EnhanceNumber in the specified Filecoin denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The balance as an EnhanceNumber.
     */
    toEnhanceNumberFil(denomination: FilecoinDenomination): EnhanceNumber {
        switch (denomination) {
            case "attofil":
                return new EnhanceNumber(Number(this.toAttoFil()))
            case "picofil":
                return new EnhanceNumber(Number(this.toPicoFil()))
            case "fil":
                return new EnhanceNumber(Number(this.toFil()))
            default:
                return new EnhanceNumber(Number(this.toFil()))
        }
    }
}

/**
 * Interface representing the structure of a market balance.
 */
export interface MarketBalance {
    Escrow: Balance
    Locked: Balance
}

/**
 * Represents a market balance entity that extends the base Entity class.
 */
export class MarketBalance extends Entity<MarketBalance> {}
