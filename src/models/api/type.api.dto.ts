import { TypeWsDTO } from "../ws/type.ws.dto";
import { NameUrlTranslatedApiDTO } from "./name-url-translated.api.dto";

export type TypeApiDTO = Omit<TypeWsDTO, 'type'> & { type?: NameUrlTranslatedApiDTO };