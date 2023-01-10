import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/server/utils/db";

const doBackfill = async () => {
    const pokeApi = new PokemonClient()
    const allPokemons = await pokeApi.listPokemons(0, 493)
    const formattedPokemons = allPokemons.results.map(
        (p, index) => (
            {
                id: index + 1,
                name: p.name,
                spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
            })
    )

    console.log("pokemon list", allPokemons);
    const deletion = await prisma.pokemon.deleteMany()
    console.log("Deleted", deletion);

    const creation = await prisma.pokemon.createMany({
        data: formattedPokemons
    })
    console.log("Created Pokemons", creation);
}


async function main() {
    await doBackfill()
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1)
    })