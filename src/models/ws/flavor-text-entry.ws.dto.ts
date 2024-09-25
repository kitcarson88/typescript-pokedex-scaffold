import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface FlavorTextEntryWsDTO {
    flavor_text?: string;
    language?:    NameUrlWsDTO;
    version?:     NameUrlWsDTO;
}