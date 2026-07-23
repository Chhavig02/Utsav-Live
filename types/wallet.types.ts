/** A user's coin wallet. Balances are only ever mutated server-side. */
export interface Wallet {
  user_id: string;
  coins_balance: number;
  lifetime_gift_coins_received: number;
  lifetime_withdrawn: number;
}
