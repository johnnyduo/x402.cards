import { parseUnits } from 'viem';

// The transaction sent 0xc8 = 200
const sentPrice = 200n;
console.log('Sent price (raw):', sentPrice.toString());
console.log('Sent price (USDC):', Number(sentPrice) / 1e6, 'USDC');

// Common minimum amounts contracts use
const minimums = [
  { amount: 1000, desc: '0.001 USDC' },
  { amount: 10000, desc: '0.01 USDC' },
  { amount: 100000, desc: '0.1 USDC' },
  { amount: 1000000, desc: '1 USDC' },
];

console.log('\nPossible minimum requirements:');
minimums.forEach(({ amount, desc }) => {
  const hex = '0x' + amount.toString(16);
  console.log(`  ${desc} = ${amount} = ${hex}`);
  if (amount > sentPrice) {
    console.log(`    ⚠️  HIGHER than sent price!`);
  }
});

console.log('\nRecommendation: The contract likely requires at least 0.001 USDC per second (1000 in 6 decimals)');
