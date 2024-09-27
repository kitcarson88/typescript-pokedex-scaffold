import { OtherWsDTO } from "./other.ws.dto";
import { VersionsWsDTO } from "./versions.ws.dto";

export interface SpritesWsDTO {
    back_default?:       string;
    back_female?:        null;
    back_shiny?:         string;
    back_shiny_female?:  null;
    front_default?:      string;
    front_female?:       null;
    front_shiny?:        string;
    front_shiny_female?: null;
    other?:             OtherWsDTO;
    versions?:          VersionsWsDTO;
    animated?:          SpritesWsDTO;
}