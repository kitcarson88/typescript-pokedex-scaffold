import { wsUrls } from "../constants";
import { requestor } from "../services/http-requestor";

export const wsMirroringRepository = {
    getPokemonApiMirroredDataByEndpoint: async <T>(endpoint: string, headers?: { [key: string]: string; }): Promise<T> => {
        const url = wsUrls.POKEAPI + endpoint;
        return await requestor.get(url, headers);
    },

    getDataByUrl: async <T>(url: string, headers?: { [key: string]: string; }): Promise<T> => {
        return await requestor.get(url, headers);
    }
  };