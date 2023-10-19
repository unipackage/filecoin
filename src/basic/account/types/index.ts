import { BigNumber } from "@glif/filecoin-number"
import { Address } from "../../address/types"
import { Balance, MarketBalance } from "../../balance/types"

export interface Account {
    Address: Address
    Balance: Balance
    Marketbalance: MarketBalance
}

export function CreateAccount(
    address: Address,
    balance: Balance,
    Escrow: Balance,
    Locked: Balance
): Account {
    return {
        Address: address,
        Balance: balance,
        Marketbalance: new MarketBalance({
            Escrow,
            Locked,
        }),
    }
}

export function GetAccountTotalBalance(account: Account): Balance {
    let totalBalance: Balance = new Balance(new BigNumber(0), "fil")
    totalBalance = new Balance(totalBalance.plus(account.Balance), "fil")
    totalBalance = new Balance(
        totalBalance.plus(account.Marketbalance.properties.Escrow),
        "fil"
    )
    totalBalance = new Balance(
        totalBalance.plus(account.Marketbalance.properties.Locked),
        "fil"
    )
    return totalBalance
}

export function GetAccountAvailableBalance(account: Account): Balance {
    let availableBalance: Balance = new Balance(new BigNumber(0), "fil")
    availableBalance = new Balance(
        availableBalance.plus(account.Balance),
        "fil"
    )
    availableBalance = new Balance(
        availableBalance.plus(account.Marketbalance.properties.Escrow),
        "fil"
    )
    return availableBalance
}
