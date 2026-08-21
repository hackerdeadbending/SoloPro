export const FALLBACK_USD_RATES = {
  USD: 1,
  EUR: 0.86,
  GBP: 0.74,
  CAD: 1.37,
  AUD: 1.53,
  NZD: 1.67,
  CHF: 0.80,
  PLN: 3.67,
  CZK: 21.2,
  SEK: 9.45,
  DKK: 6.43,
  NOK: 10.25,
  ISK: 122,
  JPY: 147,
  KRW: 1390,
  SGD: 1.28,
  AED: 3.6725,
};

export function currencyCodeFor(country) {
  const map = { IT:'EUR',FR:'EUR',DE:'EUR',ES:'EUR',PT:'EUR',NL:'EUR',BE:'EUR',AT:'EUR',IE:'EUR',LU:'EUR',FI:'EUR',GB:'GBP',US:'USD',CA:'CAD',AU:'AUD',NZ:'NZD',CH:'CHF',PL:'PLN',CZ:'CZK',SE:'SEK',DK:'DKK',NO:'NOK',IS:'ISK',JP:'JPY',KR:'KRW',SG:'SGD',AE:'AED' };
  return map[country?.code] || 'USD';
}

export function formatCurrency(value, country, locale) {
  return new Intl.NumberFormat(locale || country?.locale || 'en-US', {
    style: 'currency',
    currency: currencyCodeFor(country),
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export function usdToLocal(usd, currencyCode, rates = FALLBACK_USD_RATES) {
  return (Number(usd) || 0) * (Number(rates?.[currencyCode]) || FALLBACK_USD_RATES[currencyCode] || 1);
}

export function formatUsdPrice(usd, country, rates, locale) {
  return formatCurrency(usdToLocal(usd, currencyCodeFor(country), rates), country, locale);
}
