export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logo: string;
}

export interface PortfolioItem {
  crypto: CryptoData;
  amount: number;
  value: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  crypto: string;
  amount: number;
  price: number;
  date: string;
}

export const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.50,
    change24h: 2.45,
    volume24h: 15234567890,
    marketCap: 847234567890,
    logo: '₿'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2650.75,
    change24h: -1.23,
    volume24h: 8234567890,
    marketCap: 318234567890,
    logo: 'Ξ'
  },
  {
    id: 'binancecoin',
    name: 'Binance Coin',
    symbol: 'BNB',
    price: 315.25,
    change24h: 0.85,
    volume24h: 1234567890,
    marketCap: 48234567890,
    logo: '🔸'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.485,
    change24h: 3.67,
    volume24h: 524567890,
    marketCap: 17234567890,
    logo: '₳'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change24h: -2.15,
    volume24h: 2134567890,
    marketCap: 42234567890,
    logo: '◎'
  }
];

export const mockPortfolio: PortfolioItem[] = [
  {
    crypto: mockCryptoData[0], // Bitcoin
    amount: 0.5,
    value: 21625.25
  },
  {
    crypto: mockCryptoData[1], // Ethereum
    amount: 2.3,
    value: 6096.73
  },
  {
    crypto: mockCryptoData[2], // BNB
    amount: 15.8,
    value: 4980.95
  },
  {
    crypto: mockCryptoData[3], // ADA
    amount: 5420,
    value: 2628.70
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    crypto: 'Bitcoin',
    amount: 0.1,
    price: 42500,
    date: '2024-03-01T10:30:00Z'
  },
  {
    id: '2',
    type: 'sell',
    crypto: 'Ethereum',
    amount: 0.5,
    price: 2700,
    date: '2024-03-01T09:15:00Z'
  },
  {
    id: '3',
    type: 'buy',
    crypto: 'Cardano',
    amount: 1000,
    price: 0.48,
    date: '2024-02-29T16:45:00Z'
  }
];

export const getTotalBalance = (): number => {
  return mockPortfolio.reduce((total, item) => total + item.value, 0);
};

export const get24hProfitLoss = (): { amount: number; percentage: number } => {
  const totalBalance = getTotalBalance();
  const profit = mockPortfolio.reduce((total, item) => {
    const change = (item.crypto.change24h / 100) * item.value;
    return total + change;
  }, 0);
  
  return {
    amount: profit,
    percentage: (profit / totalBalance) * 100
  };
};