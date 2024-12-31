import { Account } from "../types";

const generateAccountNumber = (): string => {
    return Math.random().toString(36).substring(2, 6).toUpperCase() +
        Math.floor(Math.random() * 100000).toString().padStart(5, '0');
};

const generateBalance = (): number => {
    return Number((Math.random() * 100000 + 1000).toFixed(2));
};

export const mockAccounts: Account[] = Array.from({ length: 10 }, () => {
    const currencies: Account['currency'][] = ['USD', 'EUR', 'PKR', 'JPY', 'CAD'];

    return {
        accountNumber: generateAccountNumber(),
        balance: generateBalance(),
        currency: currencies[Math.floor(Math.random() * currencies.length)]
    };
});
