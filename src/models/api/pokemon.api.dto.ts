export interface PokemonApiDTO {
    id?: number;
    name?: string,
    description?: string,
    "main-type"?: string,
    "other-types"?: string[],
    thumbnail?: string,
    url?: string,
}