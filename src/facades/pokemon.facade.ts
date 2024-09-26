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

import "../utils/extensions/string.extension";

export class PokemonFacade {
    public async getPokemonList(hostUrl: string, endpoint: string, language: string = 'en'): Promise<PaginationWsDTO<PokemonApiDTO[]>> {
        var resultList: PokemonApiDTO[] = [];
        endpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
        
        // const data = await wsMirroringRepository.getPokemonApiMirroredDataByEndpoint(endpoint);

        // // Replace in response base urls with local server host url
        // const dataString = JSON.stringify(data).replace(new RegExp(wsUrls.POKEAPI!, 'g'), hostUrl);
        // const pokemonData: PaginationWsDTO<NameUrlWsDTO[]> = JSON.parse(dataString);

        const pokemonData: PaginationWsDTO<NameUrlWsDTO[]> = await wsMirroringRepository.getPokemonApiMirroredDataByEndpoint(endpoint);

        if (pokemonData?.results?.length) {
            var thumbnailBaseUrl: string | undefined;
            var idThumbnailToReplace: string | undefined;
            var thumbnailExtension: string | undefined;

            if (pokemonData.results[0].url?.length) {
                const firstResultDetail: PokemonDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemonData.results[0].url, { 'Accept-Language': language });
                
                if (firstResultDetail?.sprites?.other?.["official-artwork"]?.front_default && firstResultDetail?.id != undefined && firstResultDetail?.id != null) {
                    thumbnailBaseUrl = firstResultDetail.sprites.other?.["official-artwork"]?.front_default;
                    thumbnailExtension = thumbnailBaseUrl.urlFileExtension();
                    idThumbnailToReplace = firstResultDetail!.id + "." + thumbnailExtension;
                }
            }

            for (const pokemon of pokemonData!.results!) {
                if (pokemon?.url) {
                    var id: number | undefined;
                    var name: string | undefined;
                    var thumbnail: string | undefined;
                    var description: string | undefined;
                    var mainType: string | undefined;
                    var otherTypes: string[] | undefined = undefined;

                    // const pokemonDetail: PokemonDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemon.url, { 'Accept-Language': language });
                    var urlToReplace = wsUrls.POKEAPI + endpoint;

                    if (pokemon?.url?.length) {
                        var idString: string = pokemon!.url!.replace(urlToReplace, "");
                        idString = idString.replace(/\//g, "");
                        id = parseInt(idString);
                    }

                    if (id === null || id === undefined) {
                        continue;
                    }

                    if (thumbnailBaseUrl?.length && idThumbnailToReplace?.length) {
                        thumbnail = thumbnailBaseUrl.replace(idThumbnailToReplace, id + "." + thumbnailExtension);
                    }

                    // if (pokemonDetail?.types?.length && pokemonDetail.types[0].type?.name?.length) {
                    //     mainType = pokemonDetail.types[0].type.name; 
                    // }

                    // if (pokemonDetail?.types?.length && pokemonDetail.types.length > 1) {
                    //     const other = pokemonDetail?.types.slice(1);
                    //     otherTypes = other.filter((typeData) => typeData?.type?.name?.length).map((typeData) => typeData!.type!.name!);
                    // }

                    // if (pokemonDetail?.species?.url) {
                    //     const pokemonSpecies: SpeciesDetailWsDTO = await wsMirroringRepository.getDataByUrl(pokemonDetail.species.url, { 'Accept-Language': language });

                    //     if (pokemonSpecies?.names?.length) {
                    //         for (const names of pokemonSpecies.names) {
                    //             if (names.language?.name === language) {
                    //                 name = names.name;
                    //             }
                    //         }
                    //     }
                        
                    //     if (pokemonSpecies?.flavor_text_entries?.length) {
                    //         for (const descriptionData of pokemonSpecies.flavor_text_entries) {
                    //             if (descriptionData.flavor_text != null &&
                    //                 descriptionData.language?.name === language &&
                    //                 descriptionData.version?.name === "lets-go-pikachu") {
                    //                     description = descriptionData.flavor_text;
                    //             }
                    //         }
                    //     }
                    // }

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
        }

        const listString = JSON.stringify(resultList).replace(new RegExp(wsUrls.POKEAPI!, 'g'), hostUrl);

        const paginatedData: PaginationWsDTO<PokemonApiDTO[]> = {
            ...pokemonData,
            results: JSON.parse(listString),
        };
        
        return paginatedData;
    }

    public async getPokemonDetail(hostUrl: string, endpoint: string, language: string = 'en'): Promise<PokemonDetailApiDTO> {
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