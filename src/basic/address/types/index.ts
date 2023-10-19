import { Address as GlifAddress, newFromString } from "@glif/filecoin-address"

export enum AddressType {
    IdAddress,
    Other,
    Unknown,
}

export class Address extends GlifAddress {
    // @ts-ignore
    address: string
    // @ts-ignore
    idAddress: string
    constructor(address: string) {
        super(newFromString(address).bytes)
        super.protocol() === 0
            ? (this.idAddress = super.toString())
            : (this.address = super.toString())
    }

    type() {
        if (super.protocol() === 0) {
            return AddressType.IdAddress
        }
        return AddressType.Other
    }
}
