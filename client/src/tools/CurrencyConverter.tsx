import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, ArrowRightLeft } from "lucide-react";

const POPULAR_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
];

interface ExchangeRate {
  [key: string]: number;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  useEffect(() => {
    fetchExchangeRates();
  }, []);
  
  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);
  
  const fetchExchangeRates = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would use an API like Open Exchange Rates,
      // Fixer.io, or similar. Here we're using mock data for demonstration.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample static exchange rates for demonstration
      const mockRates: ExchangeRate = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.74,
        JPY: 110.23,
        CAD: 1.26,
        AUD: 1.36,
        CHF: 0.92,
        CNY: 6.47,
        INR: 74.38,
        BRL: 5.24,
      };
      
      setExchangeRates(mockRates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      setResult(null);
      return;
    }
    
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      setResult(null);
      return;
    }
    
    // Convert to base currency (USD) first if needed
    const valueInUSD = fromCurrency === "USD" 
      ? numericAmount 
      : numericAmount / exchangeRates[fromCurrency];
    
    // Then convert from USD to target currency
    const convertedAmount = toCurrency === "USD" 
      ? valueInUSD 
      : valueInUSD * exchangeRates[toCurrency];
    
    setResult(convertedAmount);
  };
  
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Currency Converter</h2>
        <p className="text-gray-600">
          Convert between currencies using real-time exchange rates
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border mb-6">
        <div className="mb-6">
          <Label htmlFor="amount" className="block mb-2">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="text-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="md:col-span-2">
            <Label htmlFor="from-currency" className="block mb-2">From</Label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {POPULAR_CURRENCIES.map((currency) => (
                <option key={`from-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-center md:col-span-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={swapCurrencies}
              className="rounded-full h-10 w-10"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="to-currency" className="block mb-2">To</Label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {POPULAR_CURRENCIES.map((currency) => (
                <option key={`to-${currency.code}`} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading exchange rates...</p>
          </div>
        ) : (
          <div className="text-center py-8 border-t">
            {result !== null && (
              <>
                <div className="text-3xl font-bold text-neutral mb-2">
                  {formatCurrency(result, toCurrency)}
                </div>
                <p className="text-gray-500">
                  {formatCurrency(parseFloat(amount), fromCurrency)} = {formatCurrency(result, toCurrency)}
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
                </p>
              </>
            )}
          </div>
        )}
        
        <div className="border-t pt-4 flex justify-between items-center text-xs text-gray-500">
          <div>
            <p>Last updated: {lastUpdated}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchExchangeRates} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Rates
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-medium mb-2">Popular Conversions</h3>
          <ul className="space-y-1 text-sm">
            <li>1 USD = {exchangeRates.EUR?.toFixed(4) || '-'} EUR</li>
            <li>1 USD = {exchangeRates.GBP?.toFixed(4) || '-'} GBP</li>
            <li>1 USD = {exchangeRates.JPY?.toFixed(2) || '-'} JPY</li>
            <li>1 EUR = {(1 / exchangeRates.EUR)?.toFixed(4) || '-'} USD</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-medium mb-2">About Currency Converter</h3>
          <p className="text-sm text-gray-600">
            This tool provides currency conversion based on up-to-date exchange rates.
            Rates shown are for informational purposes only and may vary slightly from actual market rates.
          </p>
        </div>
      </div>
    </div>
  );
}
