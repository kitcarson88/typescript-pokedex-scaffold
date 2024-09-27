import { EvolutionChainWsDTO } from "./evolution-chain.ws.dto";
import { FlavorTextEntryWsDTO } from "./flavor-text-entry.ws.dto";
import { GenusWsDTO } from "./genus.ws.dto";
import { NameUrlWsDTO } from "./name-url.ws.dto";
import { NameWsDTO } from "./name.ws.dto";
import { PalParkEncounterWsDTO } from "./pal-park-encounter.ws.dto";
import { PokedexNumberWsDTO } from "./pokedex-number.ws.dto";
import { VarietyWsDTO } from "./variety.ws.dto";

export interface SpeciesDetailWsDTO {
    base_happiness?:         number;
    capture_rate?:           number;
    color?:                  NameUrlWsDTO;
    egg_groups?:             NameUrlWsDTO[];
    evolution_chain?:        EvolutionChainWsDTO;
    evolves_from_species?:   null;
    flavor_text_entries?:    FlavorTextEntryWsDTO[];
    form_descriptions?:      any[];
    forms_switchable?:       boolean;
    gender_rate?:            number;
    genera?:                 GenusWsDTO[];
    generation?:             NameUrlWsDTO;
    growth_rate?:            NameUrlWsDTO;
    habitat?:                NameUrlWsDTO;
    has_gender_differences?: boolean;
    hatch_counter?:          number;
    id?:                     number;
    is_baby?:                boolean;
    is_legendary?:           boolean;
    is_mythical?:            boolean;
    name?:                   string;
    names?:                  NameWsDTO[];
    order?:                  number;
    pal_park_encounters?:    PalParkEncounterWsDTO[];
    pokedex_numbers?:        PokedexNumberWsDTO[];
    shape?:                  NameUrlWsDTO;
    varieties?:              VarietyWsDTO[];
}
