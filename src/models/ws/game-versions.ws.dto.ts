export interface RedBlueWsDTO {
    back_default?:      string;
    back_gray?:         string;
    back_transparent?:  string;
    front_default?:     string;
    front_gray?:        string;
    front_transparent?: string;
}

export interface CrystalWsDTO {
    back_default?:            string;
    back_shiny?:              string;
    back_shiny_transparent?:  string;
    back_transparent?:        string;
    front_default?:           string;
    front_shiny?:             string;
    front_shiny_transparent?: string;
    front_transparent?:       string;
}

export interface GoldWsDTO {
    back_default?:       string;
    back_shiny?:         string;
    front_default?:      string;
    front_shiny?:        string;
    front_transparent?: string;
}

export interface HomeWsDTO {
    front_default?:      string;
    front_female?:       null;
    front_shiny?:        string;
    front_shiny_female?: null;
}

export interface DreamWorldWsDTO {
    front_default?: string;
    front_female?:  null;
}
