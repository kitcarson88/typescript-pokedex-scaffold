import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface PalParkEncounterWsDTO {
    area?:       NameUrlWsDTO;
    base_score?: number;
    rate?:       number;
}