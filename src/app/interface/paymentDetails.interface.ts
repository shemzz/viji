export interface PaymentDetailsInterface
{
    reference: string,
    totalCollected: number,
    amount: number,
    fee: number,
    sellerId: number,
    buyerId: number,
    transactionId: number,
    success: boolean
}