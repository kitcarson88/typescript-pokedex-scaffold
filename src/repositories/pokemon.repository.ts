import { endpoints } from "../constants";
import { NameUrlWsDTO } from "../models/ws/name-url.ws.dto";
import { PaginationWsDTO } from "../models/ws/pagination.ws.dto";
import { requestor } from "../services/http-requestor";

export const pokemonRepository = {
    getPokemon: async (limit?: number | string, offset?: number | string): Promise<PaginationWsDTO<NameUrlWsDTO[]>> => {
        const url = process.env.POKEAPI_URL + "/" + endpoints.POKEMON;
        
        var queryParams: {[key: string]: string} | undefined = {};
        
        if (limit != undefined && limit != null) {
            queryParams["limit"] = limit!.toString();
        }
        if (offset != undefined && offset != null) {
            queryParams["offset"] = offset!.toString();
        }

        return await requestor.get(url, { queryParams });
    }
  };