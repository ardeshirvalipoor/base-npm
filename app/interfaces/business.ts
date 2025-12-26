
export type TBusiness = {
    id?: string
    temp_id: string
    name: string
    image?: string
    updated_at: string
    created_at: string
    synced: number // 0 or 1 for true or false because of indexeddb limitations
    deleted?: number // 0 or 1 for true or false because of indexeddb limitations
    user_id?: string
}

export type TCreateBusiness = Pick<
    TBusiness,
    'name' | 'temp_id' | 'user_id' | 'updated_at' | 'created_at' | 'synced'
>