
export interface Paginacion<T> {
    content:       T[];
    size:          number;
    page:          number;
    totalPages:    number;
    totalElements: number;
}