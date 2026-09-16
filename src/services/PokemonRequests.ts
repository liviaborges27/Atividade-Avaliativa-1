import Pokemon from "@/src/interface/InterfacePokemon";

class Requests {
    private api_url;
    private image_url;

    constructor() {
        this.api_url = 'https://pokeapi.co/api/v2/pokemon/';
        this.image_url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/';
    }

    async fetchPokemonList(offset = 0, limit = 20) {
        try {
            const pokemons: Pokemon[] = [];

            const api_response = await fetch(`${this.api_url}?offset=${offset}&limit=${limit}`);

            if (api_response.ok) {
                const jsonData = await api_response.json();
                jsonData.results.forEach((pokemon: any) => {
                    const urlParts = pokemon.url.split('/');
                    const idString = urlParts[urlParts.length - 2];
                    const id = parseInt(idString, 10);
                    pokemons.push({
                        pokemon_name: pokemon.name,
                        pokemon_image: `${this.image_url}${id}.gif`,
                        pokemon_id: id
                    });
                });

                return pokemons;
            }
        } catch (error) {
            console.error(`[service/Requests] Erro ao fazer requisição à API. ${error}`);
        }
    }

    async fetchPokemonData(pokemon_name: string) {
        try {
            const normalized_name = pokemon_name.toLowerCase().trim();
            const pokemon = {
                pokemon_name: '',
                pokemon_id: 0,
                pokemon_image: '',
                pokemon_shiny_image: '',
                description: '',
                types: [] as string[]
            };
            const api_response = await fetch(`${this.api_url}${normalized_name}`);

            if (api_response.ok) {
                const pokemon_info = await api_response.json();
                const showdownSprite = pokemon_info.sprites?.other?.showdown ?? {};

                pokemon.pokemon_name = pokemon_info.name;
                pokemon.pokemon_id = pokemon_info.id;
                pokemon.pokemon_image = showdownSprite.front_default || pokemon_info.sprites?.front_default || `${this.image_url}${pokemon.pokemon_id}.gif`;
                pokemon.pokemon_shiny_image = showdownSprite.front_shiny || pokemon_info.sprites?.front_shiny || pokemon.pokemon_image;
                pokemon.types = pokemon_info.types.map((t: any) => t.type.name);

                // Fetch Pokemon species description
                try {
                    const species_response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.pokemon_id}`);
                    if (species_response.ok) {
                        const species_data = await species_response.json();
                        // Find first Portuguese flavor text, otherwise fallback to English
                        let entry = species_data.flavor_text_entries.find((e: any) => e.language.name === 'pt-BR' || e.language.name === 'pt');
                        if (!entry) {
                            entry = species_data.flavor_text_entries.find((e: any) => e.language.name === 'en');
                        }
                        if (entry) {
                            pokemon.description = entry.flavor_text.replace(/[\s\f\n\r]+/g, ' ').trim();
                        }
                    }
                } catch (species_error) {
                    console.error(`[service/Requests] Erro ao obter descrição: ${species_error}`);
                }

                return pokemon;
            }

            console.log('Não foi possível obter os dados do Pokémon.');
            return;
        } catch (error) {
            console.error(`[service/Requests] Erro ao fazer requisição à API. ${error}`);
        }
    }
}

export default new Requests;