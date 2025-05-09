/* eslint-disable no-unused-vars */

export enum Routes {
  ROOT = "/",
  // Account
  ACCOUNT_CREATE = "/account/create",
  ACCOUNT_FUND = "/account/fund",
  ACCOUNT_CREATE_MUXED = "/account/muxed-create",
  ACCOUNT_PARSE_MUXED = "/account/muxed-parse",
  SAVED_KEYPAIRS = "/account/saved",
  // Endpoints
  ENDPOINTS = "/endpoints",
  ENDPOINTS_SAVED = "/endpoints/saved",
  ENDPOINTS_RPC = "/endpoints/rpc",
  // Endpoints Horizon
  ENDPOINTS_ACCOUNTS = "/endpoints/accounts",
  ENDPOINTS_ACCOUNTS_SINGLE = "/endpoints/accounts/single",
  ENDPOINTS_ASSETS = "/endpoints/assets",
  ENDPOINTS_CLAIMABLE_BALANCES = "/endpoints/claimable-balances",
  ENDPOINTS_CLAIMABLE_BALANCES_SINGLE = "/endpoints/claimable-balances/single",
  ENDPOINTS_EFFECTS = "/endpoints/effects",
  ENDPOINTS_EFFECTS_ACCOUNT = "/endpoints/effects/account",
  ENDPOINTS_EFFECTS_LEDGER = "/endpoints/effects/ledger",
  ENDPOINTS_EFFECTS_LIQUIDITY_POOL = "/endpoints/effects/liquidity-pool",
  ENDPOINTS_EFFECTS_OPERATION = "/endpoints/effects/operation",
  ENDPOINTS_EFFECTS_TRANSACTION = "/endpoints/effects/transaction",
  ENDPOINTS_FEE_STATS = "/endpoints/fee-stats",
  ENDPOINTS_LEDGERS = "/endpoints/ledgers",
  ENDPOINTS_LEDGERS_SINGLE = "/endpoints/ledgers/single",
  ENDPOINTS_LIQUIDITY_POOLS = "/endpoints/liquidity-pools",
  ENDPOINTS_LIQUIDITY_POOLS_SINGLE = "/endpoints/liquidity-pools/single",
  ENDPOINTS_OFFERS = "/endpoints/offers",
  ENDPOINTS_OFFERS_SINGLE = "/endpoints/offers/single",
  ENDPOINTS_OFFERS_ACCOUNT = "/endpoints/offers/account",
  ENDPOINTS_OPERATIONS = "/endpoints/operations",
  ENDPOINTS_OPERATIONS_SINGLE = "/endpoints/operations/single",
  ENDPOINTS_OPERATIONS_ACCOUNT = "/endpoints/operations/account",
  ENDPOINTS_OPERATIONS_LEDGER = "/endpoints/operations/ledger",
  ENDPOINTS_OPERATIONS_LIQUIDITY_POOL = "/endpoints/operations/liquidity-pool",
  ENDPOINTS_OPERATIONS_TRANSACTION = "/endpoints/operations/transaction",
  ENDPOINTS_ORDER_BOOK_DETAILS = "/endpoints/order-book/details",
  ENDPOINTS_PATHS = "/endpoints/paths",
  ENDPOINTS_PATHS_STRICT_RECEIVE = "/endpoints/paths/strict-receive",
  ENDPOINTS_PATHS_STRICT_SEND = "/endpoints/paths/strict-send",
  ENDPOINTS_PAYMENTS = "/endpoints/payments",
  ENDPOINTS_PAYMENTS_ACCOUNT = "/endpoints/payments/account",
  ENDPOINTS_PAYMENTS_LEDGER = "/endpoints/payments/ledger",
  ENDPOINTS_PAYMENTS_TRANSACTION = "/endpoints/payments/transaction",
  ENDPOINTS_TRADE_AGGREGATIONS = "/endpoints/trade-aggregations",
  ENDPOINTS_TRADES = "/endpoints/trades",
  ENDPOINTS_TRADES_ACCOUNT = "/endpoints/trades/account",
  ENDPOINTS_TRADES_LIQUIDITY_POOL = "/endpoints/trades/liquidity-pool",
  ENDPOINTS_TRADES_OFFER = "/endpoints/trades/offer",
  ENDPOINTS_TRANSACTIONS = "/endpoints/transactions",
  ENDPOINTS_TRANSACTIONS_SINGLE = "/endpoints/transactions/single",
  ENDPOINTS_TRANSACTIONS_POST = "/endpoints/transactions/post",
  ENDPOINTS_TRANSACTIONS_POST_ASYNC = "/endpoints/transactions/post-async",
  ENDPOINTS_TRANSACTIONS_ACCOUNT = "/endpoints/transactions/account",
  ENDPOINTS_TRANSACTIONS_LEDGER = "/endpoints/transactions/ledger",
  ENDPOINTS_TRANSACTIONS_LIQUIDITY_POOL = "/endpoints/transactions/liquidity-pool",
  // Endpoints RPC
  ENDPOINTS_GET_EVENTS = "/endpoints/rpc/get-events",
  ENDPOINTS_GET_FEE_STATS = "/endpoints/rpc/get-fee-stats",
  ENDPOINTS_GET_HEALTH = "/endpoints/rpc/get-health",
  ENDPOINTS_GET_LATEST_LEDGER = "/endpoints/rpc/get-latest-ledger",
  ENDPOINTS_GET_LEDGER_ENTRIES = "/endpoints/rpc/get-ledger-entries",
  ENDPOINTS_GET_LEDGERS = "/endpoints/rpc/get-ledgers",
  ENDPOINTS_GET_NETWORK = "/endpoints/rpc/get-network",
  ENDPOINTS_GET_TRANSACTION = "/endpoints/rpc/get-transaction",
  ENDPOINTS_GET_TRANSACTIONS = "/endpoints/rpc/get-transactions",
  ENDPOINTS_GET_VERSION_INFO = "/endpoints/rpc/get-version-info",
  ENDPOINTS_SEND_TRANSACTION = "/endpoints/rpc/send-transaction",
  ENDPOINTS_SIMULATE_TRANSACTION = "/endpoints/rpc/simulate-transaction",
  // Transactions
  BUILD_TRANSACTION = "/transaction/build",
  SIGN_TRANSACTION = "/transaction/sign",
  CLI_SIGN_TRANSACTION = "/transaction/cli-sign",
  SIMULATE_TRANSACTION = "/transaction/simulate",
  SUBMIT_TRANSACTION = "/transaction/submit",
  FEE_BUMP_TRANSACTION = "/transaction/fee-bump",
  SAVED_TRANSACTIONS = "/transaction/saved",
  // View XDR
  VIEW_XDR = "/xdr/view",
  TO_XDR = "/xdr/to",
  // Smart Contracts
  SMART_CONTRACTS = "/smart-contracts",
  SMART_CONTRACTS_CONTRACT_EXPLORER = "/smart-contracts/contract-explorer",
  SMART_CONTRACTS_CONTRACT_LIST = "/smart-contracts/contract-list",
  // Blockchain Explorer
  BLOCKCHAIN_EXPLORER = "/explorer",
}
