export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type Account = {
  __typename?: 'Account';
  bank: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type AccountEdge = {
  __typename?: 'AccountEdge';
  node?: Maybe<Account>;
};

export type AccountResponse = {
  __typename?: 'AccountResponse';
  edges?: Maybe<Array<Maybe<AccountEdge>>>;
  pageInfo?: Maybe<OffsetPaginationInfo>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Category = {
  __typename?: 'Category';
  color?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  node?: Maybe<Category>;
};

export type CategoryResponse = {
  __typename?: 'CategoryResponse';
  edges?: Maybe<Array<Maybe<CategoryEdge>>>;
  pageInfo?: Maybe<OffsetPaginationInfo>;
};

export type Count = {
  __typename?: 'Count';
  _all: Scalars['Int'];
};

export type CursorPaginationPageInfo = {
  __typename?: 'CursorPaginationPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateTransactionCategory?: Maybe<Transaction>;
};


export type MutationUpdateTransactionCategoryArgs = {
  categoryName: Scalars['String'];
  transactionId: Scalars['String'];
};

export type OffsetPaginationInfo = {
  __typename?: 'OffsetPaginationInfo';
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  accountById?: Maybe<Account>;
  accountsCount?: Maybe<Count>;
  autocompleteAccountBanks?: Maybe<Array<Maybe<Account>>>;
  autocompleteCategory?: Maybe<Array<Maybe<Category>>>;
  categoriesCount?: Maybe<Count>;
  categoryById?: Maybe<Category>;
  paginatedAccounts?: Maybe<AccountResponse>;
  paginatedCategories?: Maybe<CategoryResponse>;
  paginatedTransactions?: Maybe<TransactionResponse>;
  transactionById?: Maybe<Transaction>;
  transactionsCount?: Maybe<Count>;
};


export type QueryAccountByIdArgs = {
  id: Scalars['String'];
};


export type QueryAutocompleteAccountBanksArgs = {
  search: Scalars['String'];
};


export type QueryAutocompleteCategoryArgs = {
  search: Scalars['String'];
};


export type QueryCategoryByIdArgs = {
  id: Scalars['String'];
};


export type QueryPaginatedAccountsArgs = {
  page: Scalars['Int'];
  sortDirection?: InputMaybe<Scalars['String']>;
  sortField?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryPaginatedCategoriesArgs = {
  page: Scalars['Int'];
  sortDirection?: InputMaybe<Scalars['String']>;
  sortField?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryPaginatedTransactionsArgs = {
  bank?: InputMaybe<Scalars['String']>;
  categoryId?: InputMaybe<Scalars['String']>;
  endingMonth?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<Scalars['String']>;
  sortField?: InputMaybe<Scalars['String']>;
  startingMonth?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryTransactionByIdArgs = {
  id: Scalars['String'];
};

export type Transaction = {
  __typename?: 'Transaction';
  Account?: Maybe<Account>;
  Category?: Maybe<Category>;
  amount: Scalars['Float'];
  currency: Scalars['String'];
  date: Scalars['String'];
  id: Scalars['String'];
  reference?: Maybe<Scalars['String']>;
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Transaction>;
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  pageInfo?: Maybe<CursorPaginationPageInfo>;
};

export type AccountByIdQueryVariables = Exact<{
  accountId: Scalars['String'];
}>;


export type AccountByIdQuery = { __typename?: 'Query', accountById?: { __typename?: 'Account', name: string, bank: string } | null };

export type AccountsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountsCountQuery = { __typename?: 'Query', accountsCount?: { __typename?: 'Count', _all: number } | null };

export type AutocompleteAccountBanksQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type AutocompleteAccountBanksQuery = { __typename?: 'Query', autocompleteAccountBanks?: Array<{ __typename?: 'Account', bank: string } | null> | null };

export type PaginatedAccountsQueryVariables = Exact<{
  take: Scalars['Int'];
  page: Scalars['Int'];
  sortField?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<Scalars['String']>;
}>;


export type PaginatedAccountsQuery = { __typename?: 'Query', paginatedAccounts?: { __typename?: 'AccountResponse', pageInfo?: { __typename?: 'OffsetPaginationInfo', hasNextPage?: boolean | null } | null, edges?: Array<{ __typename?: 'AccountEdge', node?: { __typename?: 'Account', id: string, name: string, bank: string } | null } | null> | null } | null };

export type AutocompleteCategoryQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type AutocompleteCategoryQuery = { __typename?: 'Query', autocompleteCategory?: Array<{ __typename?: 'Category', id: string, name: string } | null> | null };

export type CategoriesCountQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesCountQuery = { __typename?: 'Query', categoriesCount?: { __typename?: 'Count', _all: number } | null };

export type CategoryByIdQueryVariables = Exact<{
  categoryId: Scalars['String'];
}>;


export type CategoryByIdQuery = { __typename?: 'Query', categoryById?: { __typename?: 'Category', name: string, color?: string | null } | null };

export type PaginatedCategoriesQueryVariables = Exact<{
  take: Scalars['Int'];
  page: Scalars['Int'];
  sortField?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<Scalars['String']>;
}>;


export type PaginatedCategoriesQuery = { __typename?: 'Query', paginatedCategories?: { __typename?: 'CategoryResponse', pageInfo?: { __typename?: 'OffsetPaginationInfo', hasNextPage?: boolean | null } | null, edges?: Array<{ __typename?: 'CategoryEdge', node?: { __typename?: 'Category', id: string, name: string, color?: string | null } | null } | null> | null } | null };

export type UpdateTransactionCategoryMutationVariables = Exact<{
  transactionId: Scalars['String'];
  categoryName: Scalars['String'];
}>;


export type UpdateTransactionCategoryMutation = { __typename?: 'Mutation', updateTransactionCategory?: { __typename?: 'Transaction', reference?: string | null, date: string, amount: number, currency: string, Category?: { __typename?: 'Category', name: string, color?: string | null } | null, Account?: { __typename?: 'Account', name: string, bank: string } | null } | null };

export type PaginatedTransactionsQueryVariables = Exact<{
  take: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  bank?: InputMaybe<Scalars['String']>;
  categoryId?: InputMaybe<Scalars['String']>;
  startingMonth?: InputMaybe<Scalars['String']>;
  endingMonth?: InputMaybe<Scalars['String']>;
  sortField?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<Scalars['String']>;
}>;


export type PaginatedTransactionsQuery = { __typename?: 'Query', paginatedTransactions?: { __typename?: 'TransactionResponse', pageInfo?: { __typename?: 'CursorPaginationPageInfo', endCursor?: string | null, hasNextPage?: boolean | null } | null, edges?: Array<{ __typename?: 'TransactionEdge', cursor?: string | null, node?: { __typename?: 'Transaction', id: string, reference?: string | null, date: string, amount: number, currency: string, Category?: { __typename?: 'Category', name: string, color?: string | null } | null } | null } | null> | null } | null };

export type TransactionByIdQueryVariables = Exact<{
  transactionId: Scalars['String'];
}>;


export type TransactionByIdQuery = { __typename?: 'Query', transactionById?: { __typename?: 'Transaction', reference?: string | null, date: string, amount: number, currency: string, Category?: { __typename?: 'Category', name: string, color?: string | null } | null, Account?: { __typename?: 'Account', name: string, bank: string } | null } | null };

export type TransactionsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsCountQuery = { __typename?: 'Query', transactionsCount?: { __typename?: 'Count', _all: number } | null };
