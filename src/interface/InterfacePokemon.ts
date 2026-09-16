export default interface Pokemon {
    pokemon_name: string,
    pokemon_image: string,
    pokemon_id?: number,
    description?: string,
    types?: string[],
    pokemon_shiny_image?: string;
}

