// import '@testing-library/jest-dom';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import PaymentForm from '../components/PaymentForm';

// describe('PaymentForm', () => {
//     it('validates required fields correctly', async () => {
//         const mockSubmit = jest.fn();
//         render(<PaymentForm onSubmit={mockSubmit} />);

//         fireEvent.click(screen.getByText('Submit Payment'));

//         await waitFor(() => {
//             expect(screen.getByText('Payer account is required')).toBeInTheDocument();
//             expect(screen.getByText('Payee account is required')).toBeInTheDocument();
//             expect(screen.getByText('Currency is required')).toBeInTheDocument();
//         });

//         expect(mockSubmit).not.toHaveBeenCalled();
//     });

//     it('validates amount field correctly', async () => {
//         const mockSubmit = jest.fn();
//         render(<PaymentForm onSubmit={mockSubmit} />);

//         const amountInput = screen.getByLabelText('Amount');
//         fireEvent.input(amountInput, { target: { value: '-10' } });

//         fireEvent.click(screen.getByText('Submit Payment'));

//         await waitFor(() => {
//             expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
//         });

//         expect(mockSubmit).not.toHaveBeenCalled();
//     });

//     it('submits form with valid data', async () => {
//         const mockSubmit = jest.fn();
//         render(<PaymentForm onSubmit={mockSubmit} />);

//         fireEvent.input(screen.getByLabelText('Payer Account'), {
//             target: { value: 'ACC123' },
//         });
//         fireEvent.input(screen.getByLabelText('Payee Account'), {
//             target: { value: 'ACC456' },
//         });
//         fireEvent.input(screen.getByLabelText('Amount'), {
//             target: { value: '100' },
//         });

//         const currencySelect = screen.getByRole('combobox');
//         fireEvent.click(currencySelect);
//         fireEvent.click(screen.getByText('US Dollar (USD)'));

//         fireEvent.click(screen.getByText('Submit Payment'));

//         await waitFor(() => {
//             expect(mockSubmit).toHaveBeenCalledWith({
//                 payerAccount: 'ACC123',
//                 payeeAccount: 'ACC456',
//                 amount: 100,
//                 currency: 'usd',
//             });
//         });
//     });

//     it('handles submission errors gracefully', async () => {
//         const mockSubmit = jest.fn(() => Promise.reject(new Error('Payment failed')));
//         render(<PaymentForm onSubmit={mockSubmit} />);

//         fireEvent.input(screen.getByLabelText('Payer Account'), {
//             target: { value: 'ACC123' },
//         });
//         fireEvent.input(screen.getByLabelText('Payee Account'), {
//             target: { value: 'ACC456' },
//         });
//         fireEvent.input(screen.getByLabelText('Amount'), {
//             target: { value: '100' },
//         });

//         const currencySelect = screen.getByRole('combobox');
//         fireEvent.click(currencySelect);
//         fireEvent.click(screen.getByText('US Dollar (USD)'));

//         fireEvent.click(screen.getByText('Submit Payment'));

//         await waitFor(() => {
//             expect(mockSubmit).toHaveBeenCalledTimes(1);
//         });
//     });
// });