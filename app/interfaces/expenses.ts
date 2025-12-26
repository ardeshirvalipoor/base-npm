
export type TExpense = {
    id?: string
    temp_id: string
    updated_at: string
    created_at: string
    synced: number // 0 or 1 for true or false because of indexeddb limitations
    deleted?: number // 0 or 1 for true or false because of indexeddb limitations
    user_id?: string
    date: string
    description: string
    amount: number
    type: 'expense' | 'income'
    business_id: string
}

export type TCreateExpense = Pick<
    TExpense,
    'temp_id' | 'user_id' | 'updated_at' | 'created_at' | 'synced' | 'deleted' | 'id' | 'description' | 'amount' | 'type' | 'business_id'
>