/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under the GNU General Public License, Version 3.0 or later (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

import { FilecoinDenomination } from "@glif/filecoin-number"
import { Entity } from "@unipackage/ddd"
import { Address } from "../../address/types"
import { Balance, MarketBalance } from "../../balance/types"

/**
 * Interface representing the structure of an account.
 */
export interface Account {
    Address: Address
    Balance: Balance
    Marketbalance: MarketBalance
}

/**
 * Represents an account entity that extends the base Entity class.
 */
export class Account extends Entity<Account> {
    /**
     * Calculates the market escrow balance in the specified denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The market escrow balance.
     */
    marketEscrowBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(this.Marketbalance.Escrow, denomination)
    }

    /**
     * Calculates the market locked balance in the specified denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The market locked balance.
     */
    marketLockedBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(this.Marketbalance.Locked, denomination)
    }

    /**
     * Calculates the basic balance in the specified denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The basic balance.
     */
    basicBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(this.Balance, denomination)
    }

    /**
     * Calculates the total balance (basic + market escrow + market locked) in the specified denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The total balance.
     */
    totalBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.basicBalance(denomination)
                .plus(this.marketEscrowBalance(denomination))
                .plus(this.marketLockedBalance(denomination)),
            denomination
        )
    }

    /**
     * Calculates the available balance (basic + market escrow) in the specified denomination.
     * @param denomination - The Filecoin denomination.
     * @returns The available balance.
     */
    availableBalance(denomination: FilecoinDenomination): Balance {
        return new Balance(
            this.basicBalance(denomination).plus(
                this.marketEscrowBalance(denomination)
            ),
            denomination
        )
    }
}
