import { NameUrlWsDTO } from "./name-url.ws.dto";

export interface VersionGroupDetailWsDTO {
    level_learned_at?:  number;
    move_learn_method?: NameUrlWsDTO;
    version_group?:     NameUrlWsDTO;
}