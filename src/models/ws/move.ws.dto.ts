import { NameUrlWsDTO } from "./name-url.ws.dto";
import { VersionGroupDetailWsDTO } from "./version-group-detail.ws.dto";

export interface MoveWsDTO {
    move?:                  NameUrlWsDTO;
    version_group_details?: VersionGroupDetailWsDTO[];
}