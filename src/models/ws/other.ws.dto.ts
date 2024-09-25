import { DreamWorldWsDTO, HomeWsDTO } from "./game-versions.ws.dto";
import { OfficialArtworkWsDTO } from "./official-artwork.ws.dto";
import { SpritesWsDTO } from "./sprites.ws.dto";

export interface OtherWsDTO {
    dream_world?:        DreamWorldWsDTO;
    home?:               HomeWsDTO;
    "official-artwork"?: OfficialArtworkWsDTO;
    showdown?:           SpritesWsDTO;
}