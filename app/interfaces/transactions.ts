export interface IAggregatedTransaction {
    total: number
    count: number
    byYear: ITransactionYear[]
}

export interface ITransactionYear {
    year: string,
    total: number,
    count: number,
    byMonth: ITransactionMonth[]
}

export interface ITransactionMonth {
    month: string,
    total: number,
    count: number,
    byDay: ITransactionDay[]
}

export interface ITransactionDay {
    wd: string,
    day: string,
    total: number,
    count: number,
    items: ITransactionItem[]
}

export interface ITransactionItem {
    id: string
    fee: string
    at: string
    deleted?: boolean
}