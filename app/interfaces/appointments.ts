export type TAppointment = {
    temp_id: string
    id?: string
    date: string // ISO date
    time: {
        from: string
        to: string
    }
    description: string
    updated_at: string
    created_at: string
    synced: number // 0 or 1 for true or false because of indexeddb limitations
    deleted?: number // 0 or 1 for true or false because of indexeddb limitations
    client_id: string
    user_id?: string
    business_id?: string
    fee?: number // later we can have multiple payments for an appointment but we always have an initial fee
}

export type TCreateAppointment = Pick<
    TAppointment,
    'date' | 'time' | 'description' | 'temp_id' | 'user_id' | 'client_id' | 'updated_at' | 'created_at' | 'synced'
>

