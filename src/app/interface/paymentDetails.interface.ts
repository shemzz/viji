export interface PaymentDetailsInterface
{
    reference: string,
    totalCollected: string,
    amount: number,
    fee: number,
    sellerId: number,
    buyerId: number,
    transactionId: number,
    success: boolean
}