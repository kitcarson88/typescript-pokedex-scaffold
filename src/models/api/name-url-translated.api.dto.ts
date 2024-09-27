import { NameUrlWsDTO } from "../ws/name-url.ws.dto";

export type NameUrlTranslatedApiDTO = NameUrlWsDTO | { translated_name?: string };