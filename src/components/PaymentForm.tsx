import React, { FC } from 'react'

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface PaymentFormProps {
    onSubmit: (data: PaymentFormValues) => Promise<void>;
    isLoading?: boolean;
}

const paymentSchema = z.object({
    payerAccount: z.string().min(1, "Payer account is required"),
    payeeAccount: z.string().min(1, "Payee account is required"),
    amount: z.number()
        .positive("Amount must be positive")
        .min(0.01, "Amount must be at least 0.01")
        .refine((val) => !isNaN(val), "Please enter a valid number"),
    currency: z.string().min(1, "Currency is required"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const PaymentForm: FC<PaymentFormProps> = ({ onSubmit, isLoading = false }) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
    });

    const submitHandler: SubmitHandler<PaymentFormValues> = (data) => {
        onSubmit(data);
    };

    return (

        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Payer Account */}
                <div>
                    <Label htmlFor="payerAccount">Payer Account</Label>
                    <Input
                        id="payerAccount"
                        type="text"
                        {...register("payerAccount")}
                        placeholder="Enter payer account"
                    />
                    {errors.payerAccount && (
                        <p className="text-red-500 text-sm">{errors.payerAccount.message}</p>
                    )}
                </div>

                {/* Payee Account */}
                <div>
                    <Label htmlFor="payeeAccount">Payee Account</Label>
                    <Input
                        id="payeeAccount"
                        type="text"
                        {...register("payeeAccount")}
                        placeholder="Enter payee account"
                    />
                    {errors.payeeAccount && (
                        <p className="text-red-500 text-sm">{errors.payeeAccount.message}</p>
                    )}
                </div>

                {/* Amount */}
                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="any"
                        defaultValue={10}
                        {...register("amount", { valueAsNumber: true })}
                        placeholder="Enter amount"
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-sm">{errors.amount.message}</p>
                    )}
                </div>

                {/* Currency */}
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Major Currencies</SelectLabel>
                                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                                        <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                                        <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
                                        <SelectItem value="chf">Swiss Franc (CHF)</SelectItem>
                                        <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Asia Pacific</SelectLabel>
                                        <SelectItem value="cny">Chinese Yuan (CNY)</SelectItem>
                                        <SelectItem value="hkd">Hong Kong Dollar (HKD)</SelectItem>
                                        <SelectItem value="sgd">Singapore Dollar (SGD)</SelectItem>
                                        <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                                        <SelectItem value="krw">South Korean Won (KRW)</SelectItem>
                                        <SelectItem value="nzd">New Zealand Dollar (NZD)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Americas</SelectLabel>
                                        <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
                                        <SelectItem value="mxn">Mexican Peso (MXN)</SelectItem>
                                        <SelectItem value="brl">Brazilian Real (BRL)</SelectItem>
                                        <SelectItem value="ars">Argentine Peso (ARS)</SelectItem>
                                        <SelectItem value="clp">Chilean Peso (CLP)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Europe & Middle East</SelectLabel>
                                        <SelectItem value="sek">Swedish Krona (SEK)</SelectItem>
                                        <SelectItem value="nok">Norwegian Krone (NOK)</SelectItem>
                                        <SelectItem value="dkk">Danish Krone (DKK)</SelectItem>
                                        <SelectItem value="try">Turkish Lira (TRY)</SelectItem>
                                        <SelectItem value="aed">UAE Dirham (AED)</SelectItem>
                                        <SelectItem value="sar">Saudi Riyal (SAR)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.currency && (
                        <p className="text-red-500 text-sm">{errors.currency.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Submit Payment'}
                </Button>
            </form>
        </div>)
};

export default PaymentForm;