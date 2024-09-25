import { CrystalWsDTO, DreamWorldWsDTO, GoldWsDTO, HomeWsDTO, RedBlueWsDTO } from "./game-versions.ws.dto";
import { OfficialArtworkWsDTO } from "./official-artwork.ws.dto";
import { SpritesWsDTO } from "./sprites.ws.dto";

export interface GenerationIWsDTO {
    "red-blue"?: RedBlueWsDTO;
    yellow?:     RedBlueWsDTO;
}

export interface GenerationIiWsDTO {
    crystal?: CrystalWsDTO;
    gold?:    GoldWsDTO;
    silver?:  GoldWsDTO;
}

export interface GenerationIiiWsDTO {
    emerald?:             OfficialArtworkWsDTO;
    "firered-leafgreen"?: GoldWsDTO;
    "ruby-sapphire"?:     GoldWsDTO;
}

export interface GenerationIvWsDTO {
    "diamond-pearl"?:        SpritesWsDTO;
    "heartgold-soulsilver"?: SpritesWsDTO;
    platinum?:               SpritesWsDTO;
}

export interface GenerationVWsDTO {
    "black-white"?: SpritesWsDTO;
}

export interface GenerationViiWsDTO {
    icons?:                  DreamWorldWsDTO;
    "ultra-sun-ultra-moon"?: HomeWsDTO;
}

export interface GenerationViiiWsDTO {
    icons?: DreamWorldWsDTO;
}
