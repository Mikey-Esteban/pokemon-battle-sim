import type { Page } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { PokemonClient } from 'pokenode-ts';

interface Pokemon {
    name: string;
    url: string;
}

const loadPokemon = async () => {

    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151')
    const pokemon = await response.json()
        .then((data) => data.results)
        .catch((error) => console.error(error));

    return pokemon;
}

const mapPokemon = async (pokemon: Array<Pokemon>) => {
    const api = new PokemonClient();

    const pokemonData = await Promise.all(

        pokemon.map( async (pokemon : Pokemon) => {
            const res = await api
                .getPokemonByName(pokemon.name)
                .then((data) => {
                    return data
                })
                .catch((error) => console.error(error));

            return res;
        })
    );

    return pokemonData;
}


export const load: PageServerLoad = async () => {

    const firstGen = await loadPokemon();
    const mappedPokemon = await mapPokemon(firstGen);
      
    return {
        page_server_data: { message: 'hello world', mapped: mappedPokemon },
    }
}