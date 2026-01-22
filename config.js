// config.js
window.APP_CONFIG = {
  CHAIN_ID_DEC: 56,
  CHAIN_ID_HEX: "0x38",
  CHAIN_NAME: "BSC Mainnet",
  BLOCK_EXPLORER: "https://bscscan.com",

  // ===== Tokens (BSC) =====
  USDT: "0x55d398326f99059fF775485246999027B3197955",   // USDT (18 decimals on BSC)
  DF:   "0x36579d7eC4b29e875E3eC21A55F71C822E03A992",   // 365df token address (your DF)

  // ===== Contracts (V3) =====
  CORE:   "0x2e119DdcFF87765FF3A525d74F40514Fb78b5DFC",  // MLMUsersCoreV3
  VAULT:  "0xf3B240c4441C4816dd2b55Ab417e7A50aD29a8F9",  // VaultV3
  STAKING:"0x8c7b90CFaC3bA481059cCE74f73407bB29D2969d",  // StakingV3
  PAYOUT: "0xB0eE07973957ED3Ea2C854b7b7c664F85FDFdBF0",  // PayoutSV3 (read-only for UI)
  BINARY: "0x822F063D6c5246354D4c146e77C9b4aE1A15563c",  // BinaryV3 (read-only for UI)

  // ===== Minimal ERC20 ABI (USDT/DF) =====
  ERC20_ABI: [
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},
    {"constant":true,"inputs":[{"name":"o","type":"address"},{"name":"s","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
    {"constant":false,"inputs":[{"name":"s","type":"address"},{"name":"v","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"}
  ],

  // ===== CoreV3 ABI =====
  CORE_ABI: [
    {"inputs":[{"internalType":"address","name":"usdt","type":"address"},{"internalType":"address","name":"df","type":"address"},{"internalType":"address","name":"staking","type":"address"},{"internalType":"address","name":"treasury_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum MLMUsersCoreV3.Package","name":"pkg","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"usdtAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dfPrincipal","type":"uint256"}],"name":"Bought","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"sponsor","type":"address"},{"indexed":false,"internalType":"bool","name":"sideRight","type":"bool"}],"name":"Registered","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"vault","type":"address"},{"indexed":false,"internalType":"address","name":"payoutA","type":"address"},{"indexed":false,"internalType":"address","name":"binary","type":"address"}],"name":"Wired","type":"event"},
    {"inputs":[],"name":"BINARY","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"BPS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"DF","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"FEE_BPS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"PAYOUTA","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"STAKING","outputs":[{"internalType":"contract IStaking365","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"USDT","outputs":[{"internalType":"contract IERC20U","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"VAULT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"enum MLMUsersCoreV3.Package","name":"newPkg","type":"uint8"},{"internalType":"address","name":"sponsor","type":"address"},{"internalType":"bool","name":"sideRight","type":"bool"}],"name":"buyOrUpgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"enum MLMUsersCoreV3.Package","name":"p","type":"uint8"}],"name":"dfPrincipal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},
    {"inputs":[{"internalType":"enum MLMUsersCoreV3.Package","name":"p","type":"uint8"}],"name":"priceUSDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},
    {"inputs":[{"internalType":"address","name":"u","type":"address"}],"name":"rankOf","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"u","type":"address"}],"name":"sideRightOf","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"u","type":"address"}],"name":"sponsorOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"address","name":"sponsor","type":"address"},{"internalType":"address","name":"parent","type":"address"},{"internalType":"bool","name":"sideRight","type":"bool"},{"internalType":"enum MLMUsersCoreV3.Package","name":"pkg","type":"uint8"},{"internalType":"enum MLMUsersCoreV3.Rank","name":"rank","type":"uint8"},{"internalType":"uint32","name":"directSmallOrMore","type":"uint32"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"vault","type":"address"},{"internalType":"address","name":"payoutA","type":"address"},{"internalType":"address","name":"binary","type":"address"}],"name":"wire","outputs":[],"stateMutability":"nonpayable","type":"function"}
  ],

  // ===== VaultV3 ABI =====
  VAULT_ABI: [
    {"inputs":[{"internalType":"address","name":"usdt","type":"address"},{"internalType":"address","name":"df","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdtAmt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dfAmt","type":"uint256"}],"name":"Credited","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdtAmt","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"dfAmt","type":"uint256"}],"name":"Claimed","type":"event"},
    {"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"earns","outputs":[{"internalType":"uint256","name":"claimUSDT","type":"uint256"},{"internalType":"uint256","name":"claimDF","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"surplusUSDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
  ],

  // ===== StakingV3 ABI =====
  STAKING_ABI: [
    {"inputs":[{"internalType":"address","name":"df","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum Staking365V3.Package","name":"pkg","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"principal","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"start","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"end","type":"uint64"}],"name":"StakedFor","type":"event"},
    {"inputs":[],"name":"claimStake","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"pendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"enum Staking365V3.Package","name":"pkg","type":"uint8"},{"internalType":"uint256","name":"principal","type":"uint256"},{"internalType":"uint64","name":"start","type":"uint64"},{"internalType":"uint64","name":"end","type":"uint64"},{"internalType":"bool","name":"claimed","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"smallDailyBps","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"mediumDailyBps","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"largeDailyBps","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"mlm","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
  ],

  // ===== PayoutSV3 (read-only) =====
  PAYOUT_ABI: [
    {"inputs":[],"name":"CORE","outputs":[{"internalType":"contract ICoreRankView","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"VAULT","outputs":[{"internalType":"contract IVaultCredit","name":"","type":"address"}],"stateMutability":"view","type":"function"}
  ],

  // ===== BinaryV3 (read-only) =====
  BINARY_ABI: [
    {"inputs":[],"name":"CORE","outputs":[{"internalType":"contract ICoreBinary","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"VAULT","outputs":[{"internalType":"contract IVaultBinaryCredit","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"u","type":"address"}],"name":"volumesOf","outputs":[{"internalType":"uint256","name":"l","type":"uint256"},{"internalType":"uint256","name":"r","type":"uint256"},{"internalType":"uint256","name":"p","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"WEAK_BONUS_BPS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"CASH_BPS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"DF_BPS","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"}
  ]
};
