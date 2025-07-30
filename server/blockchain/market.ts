import axios from 'axios';
import { MarketPrice } from './types';

export class MarketDataService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private readonly BINANCE_API = 'https://api.binance.com/api/v3';

  async getCurrentPrice(symbol: string): Promise<MarketPrice | null> {
    try {
      // Use CoinGecko for reliable market data
      const coinId = this.getCoinGeckoId(symbol);
      const response = await axios.get(
        `${this.COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      const data = response.data[coinId];
      if (!data) return null;

      return {
        symbol,
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }

  async getMultiplePrices(symbols: string[]): Promise<MarketPrice[]> {
    const prices = await Promise.all(
      symbols.map(symbol => this.getCurrentPrice(symbol))
    );
    return prices.filter(price => price !== null) as MarketPrice[];
  }

  async getHistoricalData(symbol: string, days: number = 7): Promise<Array<{timestamp: number, price: number}>> {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await axios.get(
        `${this.COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );

      return response.data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'TRX': 'tron',
      'SOL': 'solana',
      'USDT': 'tether',
      'USDC': 'usd-coin'
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  async getTopCryptocurrencies(limit: number = 10): Promise<MarketPrice[]> {
    try {
      const response = await axios.get(
        `${this.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );

      return response.data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        volume24h: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching top cryptocurrencies:', error);
      return [];
    }
  }

  async startPriceUpdates(symbols: string[], intervalMs: number = 60000): Promise<void> {
    const updatePrices = async () => {
      try {
        await this.getMultiplePrices(symbols);
        console.log(`Updated prices for: ${symbols.join(', ')}`);
      } catch (error) {
        console.error('Error in price update:', error);
      }
    };

    // Initial update
    updatePrices();

    // Set up interval for regular updates
    setInterval(updatePrices, intervalMs);
  }
}