import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface StatWsDTO {
    base_stat?: number;
    effort?:    number;
    stat?:      NameUrlWsDTO;
}