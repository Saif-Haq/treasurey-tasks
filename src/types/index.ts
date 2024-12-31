export type Account = {
    accountNumber: string;
    balance: number;
    currency: 'USD' | 'EUR' | 'PKR' | 'JPY' | 'CAD';
};