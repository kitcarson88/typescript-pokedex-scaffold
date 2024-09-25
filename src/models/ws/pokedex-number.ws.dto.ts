import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface PokedexNumberWsDTO {
    entry_number?: number;
    pokedex?:      NameUrlWsDTO;
}