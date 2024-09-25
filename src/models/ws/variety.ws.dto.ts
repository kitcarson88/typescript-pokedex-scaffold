import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface VarietyWsDTO {
    is_default?: boolean;
    pokemon?:    NameUrlWsDTO;
}