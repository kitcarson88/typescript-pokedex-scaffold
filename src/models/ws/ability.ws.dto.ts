import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface AbilityWsDTO {
    ability?:   NameUrlWsDTO;
    is_hidden?: boolean;
    slot?:      number;
}
