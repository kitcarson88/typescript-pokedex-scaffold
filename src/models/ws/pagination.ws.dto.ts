export interface PaginationWsDTO<T> {
    count?: number,
    next?: string,
    previous?: string,
    results?: T,
}