import { PokemonDetailWsDTO } from "../ws/pokemon-detail.ws.dto";
import { StatApiDTO } from "./stat.api.dto";
import { TypeApiDTO } from "./type.api.dto";

export type PokemonDetailApiDTO =
    Omit<Omit<PokemonDetailWsDTO, 'types'>, 'stats'> &
    {
        types?: TypeApiDTO[],
        stats?: StatApiDTO[],
    };