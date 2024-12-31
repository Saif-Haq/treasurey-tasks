'use client';

import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import PaymentForm, { PaymentFormValues } from '@/components/PaymentForm';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Button } from '../../components/ui/button';

const mockProcessPayment = async (data: PaymentFormValues): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (data.amount > 1000000000) {
    throw new Error('Amount exceeds maximum limit of 1000000000');
  }
  if (data.currency === 'jpy' && data.amount < 100) {
    throw new Error('Minimum amount for JPY is 100');
  }
  if (data.payerAccount === data.payeeAccount) {
    throw new Error('Payer and payee accounts cannot be the same');
  }

  // Random failure (50% chance)
  if (Math.random() < 0.5) {
    throw new Error('Transaction failed. Please try again.');
  }
};

const TaskOne = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    try {
      await mockProcessPayment(data);
      toast.success('Payment successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-20 px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="mx-auto block">
              <InfoIcon className="text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>I have used Zod for validation and React Hook Form for form handling along with Shadcn and React Hot Toast.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className='mx-auto'>
        <h1 className="text-2xl font-bold mb-6 text-center gap-5">Make a Payment</h1>
      </div>
      <PaymentForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>)
}

export default TaskOne;