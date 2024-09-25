import { AbilityWsDTO } from "./ability.ws.dto";
import { CriesWsDTO } from "./cries.ws.dto";
import { GameIndexWsDTO } from "./game-index.ws.dto";
import { MoveWsDTO } from "./move.ws.dto";
import { NameUrlWsDTO } from "./name-url.ws.dto";
import { SpritesWsDTO } from "./sprites.ws.dto";
import { StatWsDTO } from "./stat.ws.dto";
import { TypeWsDTO } from "./type.ws.dto";

export interface PokemonDetailWsDTO {
    abilities?:                AbilityWsDTO[];
    base_experience?:          number;
    cries?:                    CriesWsDTO;
    forms?:                    NameUrlWsDTO[];
    game_indices?:             GameIndexWsDTO[];
    height?:                   number;
    held_items?:               any[];
    id?:                       number;
    is_default?:               boolean;
    location_area_encounters?: string;
    moves?:                    MoveWsDTO[];
    name?:                     string;
    order?:                    number;
    past_abilities?:           any[];
    past_types?:               any[];
    species?:                  NameUrlWsDTO;
    sprites?:                  SpritesWsDTO;
    stats?:                    StatWsDTO[];
    types?:                    TypeWsDTO[];
    weight?:                   number;
}