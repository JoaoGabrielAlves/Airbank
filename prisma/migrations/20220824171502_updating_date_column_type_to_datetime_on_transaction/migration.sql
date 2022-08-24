/*
  Warnings:

  - Changed the type of `amount` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Transaction_categoryId_accountId_idx";

-- DropIndex
DROP INDEX "Transaction_reference_amount_currency_date_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Transaction_reference_amount_currency_date_categoryId_idx" ON "Transaction"("reference", "amount", "currency", "date", "categoryId");
