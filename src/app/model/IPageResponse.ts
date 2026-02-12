export interface IPageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // Current page number (0-based index)
}