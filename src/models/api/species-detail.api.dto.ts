import { SpeciesDetailWsDTO } from "../ws/species-detail.ws.dto";

export type SpeciesDetailApiDTO = Omit<SpeciesDetailWsDTO, "genera"> & { genera?: string,};