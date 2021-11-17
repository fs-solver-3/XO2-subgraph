import { Address, store, BigInt, log } from "@graphprotocol/graph-ts";
import { ZERO_ADDRESS } from "@protofire/subgraph-toolkit";
import { Account, TransactionHistory } from "../generated/schema";
import { Transfer } from "../generated/XO2Contract/XO2Contract";

// export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

/**
 * Handler called when transfer transacion happens
 **/
export function handleTransaction(event: Transfer): void {
  let fromAddress = event.params.from.toHexString();
  let toAddress = event.params.to.toHexString();

  log.info("FromAddress: {}", [fromAddress]);

  let fromAddressAccount = Account.load(fromAddress);
  let toAddressAccount = Account.load(toAddress);

  if (fromAddressAccount && fromAddress !== ZERO_ADDRESS) {
    fromAddressAccount.balance = fromAddressAccount.balance.minus(
      event.params.value
    );
    fromAddressAccount.save();
  }
  if (toAddressAccount && toAddress != ZERO_ADDRESS) {
    toAddressAccount.balance = toAddressAccount.balance.plus(
      event.params.value
    );
    toAddressAccount.save();
  }

  // save Transaction History
  // log.info("Transaction Info: {}", [event.transaction.toString()]);

  let txnHistory = new TransactionHistory(event.transaction.hash.toString());
  txnHistory.txnHash = event.transaction.hash;
  txnHistory.from = event.transaction.from;
  // txnHistory.to = event.transaction.to;
  txnHistory.value = event.transaction.value;
  txnHistory.save();
}
