import { StatWsDTO } from "../ws/stat.ws.dto";
import { NameUrlTranslatedApiDTO } from "./name-url-translated.api.dto";

export type StatApiDTO = Omit<StatWsDTO, 'stat'> & { stat?: NameUrlTranslatedApiDTO };