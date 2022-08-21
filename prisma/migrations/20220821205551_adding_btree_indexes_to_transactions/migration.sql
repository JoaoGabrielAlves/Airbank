-- CreateIndex
CREATE INDEX "Transaction_reference_amount_currency_date_idx" ON "Transaction"("reference", "amount", "currency", "date");
