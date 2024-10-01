import { cloneDeep, isNaN } from "lodash";
import { wsUrls } from "../constants";
import { PokemonDetailApiDTO } from "../models/api/pokemon-detail.api.dto";
import { PokemonApiDTO } from "../models/api/pokemon.api.dto";
import { SpeciesDetailApiDTO } from "../models/api/species-detail.api.dto";
import { NameUrlWsDTO } from "../models/ws/name-url.ws.dto";
import { PaginationWsDTO } from "../models/ws/pagination.ws.dto";
import { PokemonDetailWsDTO } from "../models/ws/pokemon-detail.ws.dto";
import { SpeciesDetailWsDTO } from "../models/ws/species-detail.ws.dto";
import { StatDetailWsDTO } from "../models/ws/stat-detail.ws.dto";
import { TypeDetailWsDTO } from "../models/ws/type-detail.ws.dto";
import { wsMirroringRepository } from "../repositories/ws-mirroring.repository";

import { namesAndDescriptionsOfPokemons } from "../mirrored-data/names-and-descriptions-of-pokemons";
import { typesOfPokemons } from "../mirrored-data/types-of-pokemons";
import "../utils/extensions/string.extension";

export class PokemonFacade {
    // private static readonly OFFSET_FOR_POPULATING_DATA = 0;
    // private static readonly LIMIT_FOR_POPULATING_DATA = 3000;

    public async getPokemonList(hostUrl: string, endpoint: string, language: string = 'en'): Promise<PaginationWsDTO<PokemonApiDTO[]>> {
        let resultList: PokemonApiDTO[] = [];
        hostUrl = hostUrl + "/";
        endpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
        let queryString = endpoint.includes("?") ? endpoint.substring(endpoint.indexOf("?") ) : "";
        endpoint = endpoint.includes("?") ? endpoint.substring(0, endpoint.indexOf("?")) : endpoint;

        const pokemonData: PaginationWsDTO<NameUrlWsDTO[]> = await wsMirroringRepository.getPokemonApiMirroredDataByEndpoint(endpoint + queryString);

        if (pokemonData?.results?.length) {
            let thumbnailBaseUrl: string | undefined;
            let idThumbnailToReplace: string | undefined;
            let thumbnailExtension: string | undefined;

            // Create base infos to deduce thumbnail urls
            if (pokemonData.results[0].url?.length) {
                const firstResultDetail: PokemonDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemonData.results[0].url, { 'Accept-Language': language });
                
                if (firstResultDetail?.sprites?.other?.["official-artwork"]?.front_default && firstResultDetail?.id != undefined && firstResultDetail?.id != null) {
                    thumbnailBaseUrl = firstResultDetail.sprites.other?.["official-artwork"]?.front_default;
                    thumbnailExtension = thumbnailBaseUrl.urlFileExtension();
                    idThumbnailToReplace = firstResultDetail!.id + "." + thumbnailExtension;
                }
            }

            // Get types of pokemons
            const types =  typesOfPokemons; // await this.getTypesOfPokemons();
            const namesAndDescriptions =  namesAndDescriptionsOfPokemons; // await this.getNamesAndDescriptionsOfPokemons();

            for (const pokemon of pokemonData!.results!) {
                let id: number | undefined;
                let name: string | undefined;
                let thumbnail: string | undefined;
                let description: string | undefined;
                let mainType: string | undefined;
                let otherTypes: string[] | undefined = undefined;

                let urlToReplace = wsUrls.POKEAPI + endpoint;

                if (pokemon?.url?.length) {
                    let idString: string = pokemon!.url!.replace(urlToReplace, "");
                    idString = idString.replace(/\//g, "");
                    id = parseInt(idString);
                }

                if (id === null || id === undefined) {
                    continue;
                }

                if (id > 9999) {    //After 9999 there are only id of pokemon forms
                    break;
                }

                if (thumbnailBaseUrl?.length && idThumbnailToReplace?.length) {
                    thumbnail = thumbnailBaseUrl.replace(idThumbnailToReplace, id + "." + thumbnailExtension);
                }

                if (pokemon.name?.length && types[pokemon.name]?.length) {
                    mainType = types[pokemon.name][0];

                    if (types[pokemon.name].length > 1) {
                        otherTypes = types[pokemon.name].slice(1);
                    }

                    if (
                        namesAndDescriptions[language] != null && namesAndDescriptions[language] != undefined &&
                        namesAndDescriptions[language][pokemon.name] != null && namesAndDescriptions[language][pokemon.name] != undefined &&
                        namesAndDescriptions[language][pokemon.name]["name"] != null && namesAndDescriptions[language][pokemon.name]["name"] != undefined
                    ) {
                        name = namesAndDescriptions[language][pokemon.name]["name"];
                    }

                    if (
                        namesAndDescriptions[language] != null && namesAndDescriptions[language] != undefined &&
                        namesAndDescriptions[language][pokemon.name] != null && namesAndDescriptions[language][pokemon.name] != undefined &&
                        namesAndDescriptions[language][pokemon.name]["description"] != null && namesAndDescriptions[language][pokemon.name]["description"] != undefined
                    ) {
                        description = namesAndDescriptions[language][pokemon.name]["description"];
                    }
                }

                // if (id != undefined &&
                //     name != undefined &&
                //     thumbnail != undefined &&
                //     description != undefined &&
                //     name != null &&
                //     mainType != null &&
                //     thumbnail != null &&
                //     description != null) {
                        resultList.push({
                            id: id,
                            name: name,
                            description: description,
                            "main-type": mainType,
                            "other-types": otherTypes,
                            thumbnail: thumbnail,
                            url: pokemon.url,
                        });
                // }
            }
        }

        const listString = JSON.stringify(resultList).replace(new RegExp(wsUrls.POKEAPI!, 'g'), hostUrl);

        const paginatedData: PaginationWsDTO<PokemonApiDTO[]> = {
            ...pokemonData,
            results: JSON.parse(listString),
        };
        
        return paginatedData;
    }

    // public async getTypesOfPokemons(): Promise<{ [name: string]: string[] }> {
    //     let types: { [name: string]: string[] } = {};

    //     const pokemonData: PaginationWsDTO<NameUrlWsDTO[]> = await pokemonRepository.getPokemon(PokemonFacade.LIMIT_FOR_POPULATING_DATA, PokemonFacade.OFFSET_FOR_POPULATING_DATA);

    //     if (pokemonData?.results?.length) {
    //         for (const pokemon of pokemonData.results) {
    //             if (pokemon?.name?.length && pokemon?.url?.length) {
    //                 const pokemonDetail: PokemonDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemon.url);
                    
    //                 types[pokemon.name] = [];
    
    //                 if (pokemonDetail?.types?.length && pokemonDetail.types[0].type?.name?.length) {
    //                     types[pokemon.name].push(pokemonDetail.types[0].type.name);
    //                 }
    
    //                 if (pokemonDetail?.types?.length && pokemonDetail.types.length > 1) {
    //                     const other = pokemonDetail?.types.slice(1);
    //                     types[pokemon.name].push(...other.filter((typeData) => typeData?.type?.name?.length).map((typeData) => typeData!.type!.name!));
    //                 }
    //             }
    //         }

    //         cache.set("types", types);
    //     }

    //     return types;
    // }

    // public async getNamesAndDescriptionsOfPokemons(): Promise<{ [name: string]: any }> {
    //     let data: { [name: string]: any } = {};

    //     const pokemonSpecies: PaginationWsDTO<NameUrlWsDTO[]> = await pokemonRepository.getPokemonSpecies(PokemonFacade.LIMIT_FOR_POPULATING_DATA, PokemonFacade.OFFSET_FOR_POPULATING_DATA);

    //     if (pokemonSpecies?.results?.length) {
    //         for (const pokemon of pokemonSpecies.results) {
    //             if (pokemon?.name?.length && pokemon?.url?.length) {
    //                 const pokemonSpeciesDetail: SpeciesDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemon.url);

    //                 if (pokemonSpeciesDetail?.names?.length) {
    //                     for (const names of pokemonSpeciesDetail.names) {
    //                         if (names.language?.name?.length && names.name?.length) {
    //                             if (data[names.language.name] == null || data[names.language.name] == undefined) {
    //                                 data[names.language.name] = {};
    //                             }

    //                             if (data[names.language.name][pokemon.name] == null || data[names.language.name][pokemon.name] == undefined) {
    //                                 data[names.language.name][pokemon.name] = {};
    //                             }

    //                             data[names.language.name][pokemon.name]["name"] = names.name;
    //                         }
    //                     }
    //                 }

    //                 if (pokemonSpeciesDetail?.flavor_text_entries?.length) {
    //                     for (const descriptionData of pokemonSpeciesDetail.flavor_text_entries) {
    //                         if (descriptionData.flavor_text != null &&
    //                             // descriptionData.version?.name === "lets-go-pikachu" &&
    //                             descriptionData.language?.name?.length) {
    //                             if (data[descriptionData.language.name] == null || data[descriptionData.language.name] == undefined) {
    //                                 data[descriptionData.language.name] = {};
    //                             }

    //                             if (data[descriptionData.language.name][pokemon.name] == null || data[descriptionData.language.name][pokemon.name] == undefined) {
    //                                 data[descriptionData.language.name][pokemon.name] = {};
    //                             }

    //                             data[descriptionData.language.name][pokemon.name]["description"] = descriptionData.flavor_text;
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //         cache.set("namesAndDescriptions", data);
    //     }

    //     return data;
    // }

    public async getPokemonDetail(hostUrl: string, endpoint: string, language: string = 'en'): Promise<PokemonDetailApiDTO> {
        hostUrl = hostUrl + "/";
        endpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;

        const data = await wsMirroringRepository.getPokemonApiMirroredDataByEndpoint(endpoint);

        // Replace in response base urls with local server host url
        const dataString = JSON.stringify(data).replace(new RegExp(wsUrls.POKEAPI!, 'g'), hostUrl);
        const detail: PokemonDetailWsDTO = JSON.parse(dataString);

        const adjustedDetail: PokemonDetailApiDTO = cloneDeep(detail) as Omit<PokemonDetailWsDTO, 'types'>;
        
        if (detail?.types?.length) {
            adjustedDetail.types = [];

            for (const typeData of detail.types) {
                if (typeData?.type?.url?.length) {
                    const type: TypeDetailWsDTO = await wsMirroringRepository.getDataByUrl(typeData.type.url, { 'Accept-Language': language });

                    if (type?.names?.length) {
                        for (const names of type.names) {
                            if (names.language?.name === language) {
                                adjustedDetail.types.push({
                                    slot: typeData.slot,
                                    type: {
                                        name: typeData.type.name,
                                        translated_name: names.name?.toLowerCase(),
                                        url: typeData.type.url,
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }

        if (detail.stats?.length) {
            adjustedDetail.stats = [];

            for (const statData of detail.stats) {
                if (!isNaN(statData.base_stat) &&  statData?.stat?.url?.length) {
                    const stat: StatDetailWsDTO = await wsMirroringRepository.getDataByUrl(statData.stat.url, { 'Accept-Language': language });

                    if (stat?.names?.length) {
                        for (const names of stat.names) {
                            if (names.language?.name === language) {
                                adjustedDetail.stats.push({
                                    base_stat: statData.base_stat,
                                    stat: {
                                        name: statData.stat.name,
                                        translated_name: names.name?.toLowerCase(),
                                        url: statData.stat.url,
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return adjustedDetail;
    }

    public async getPokemonSpeciesDetail(hostUrl: string, endpoint: string, language: string = 'en'): Promise<SpeciesDetailApiDTO> {
        const data = await wsMirroringRepository.getPokemonApiMirroredDataByEndpoint(endpoint);

        // Replace in response base urls with local server host url
        const dataString = JSON.stringify(data).replace(new RegExp(wsUrls.POKEAPI!, 'g'), hostUrl);
        const detail: SpeciesDetailWsDTO = JSON.parse(dataString);

        const adjustedDetail = (cloneDeep(detail) as Omit<SpeciesDetailWsDTO, 'genera'>) as SpeciesDetailApiDTO;
        if (detail.genera?.length) {
            for (const generaData of detail!.genera!) {
                if (generaData.language?.name === language) {
                    adjustedDetail.genera = generaData.genus;
                }
            }
        }

        if (adjustedDetail.flavor_text_entries?.length) {
            adjustedDetail.flavor_text_entries = adjustedDetail.flavor_text_entries?.filter((flavorData) => flavorData.language?.name === language);
        }

        return adjustedDetail;
    }
}