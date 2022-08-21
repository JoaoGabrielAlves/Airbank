-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "reference" TEXT,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE INDEX "Account_name_idx" ON "Account"("name");

-- CreateIndex
CREATE INDEX "Account_bank_idx" ON "Account"("bank");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_accountId_idx" ON "Transaction"("categoryId", "accountId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
