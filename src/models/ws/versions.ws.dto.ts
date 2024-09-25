import { GenerationIWsDTO, GenerationIiWsDTO, GenerationIiiWsDTO, GenerationIvWsDTO, GenerationVWsDTO, GenerationViiWsDTO, GenerationViiiWsDTO } from "./generation.ws.dto";

export interface VersionsWsDTO {
    "generation-i"?:    GenerationIWsDTO;
    "generation-ii"?:   GenerationIiWsDTO;
    "generation-iii"?:  GenerationIiiWsDTO;
    "generation-iv"?:   GenerationIvWsDTO;
    "generation-v"?:    GenerationVWsDTO;
    // "generation-vi"?:   GenerationViWsDTO;
    "generation-vii"?:  GenerationViiWsDTO;
    "generation-viii"?: GenerationViiiWsDTO;
}