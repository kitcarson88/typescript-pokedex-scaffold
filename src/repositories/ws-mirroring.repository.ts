import { requestor } from "../services/http-requestor";

export const wsMirroringRepository = {
    getMirroredDataByEndpoint: async <T>(endpoint: string, headers?: { [key: string]: string; }): Promise<T> => {
        const url = process.env.POKEAPI_URL + "/" + endpoint;
        return await requestor.get(url, headers);
    },

    getDataByUrl: async <T>(url: string, headers?: { [key: string]: string; }): Promise<T> => {
        return await requestor.get(url, headers);
    }
  };