import { NameWsDTO } from "./name.ws.dto";

export interface StatDetailWsDTO {
    game_index?:        number;
    id?:                number;
    is_battle_only?:    boolean;
    name?:              string;
    names?:             NameWsDTO[];
}