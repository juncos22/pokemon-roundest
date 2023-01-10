import { prisma } from "@/server/utils/db";
import { AsyncReturnType } from "@/utils/ts-bs";
import { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";

type PokemonQueryResult = AsyncReturnType<typeof getOrderedPokemons>

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (props) => {
    return (
        <div className="flex border-b p-2 items-center w-full">
            <Image
                width={150} height={150}
                src={props.pokemon.spriteUrl}
                alt={props.pokemon.name} />
            <div className="capitalize">{props.pokemon.name}</div>
        </div>
    )
}
const ResultsPage: React.FC<{ pokemons: PokemonQueryResult }> = (props) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl p-4">Results</h2>
            <div className="flex flex-col w-full max-w-2xl border">
            {props.pokemons.map(currentPokemon => (
                <PokemonListing
                    pokemon={currentPokemon}
                    key={currentPokemon.id} />
            ))}
            </div>
        </div>
    );
}

const getOrderedPokemons = async () => {
    return await prisma.pokemon.findMany({
        orderBy: {
            votesFor: {
                _count: 'desc'
            }
        },
        select: {
            id: true,
            name: true,
            spriteUrl: true,
            _count: {
                select: {
                    votesFor: true,
                    votesAgainst: true
                }
            }
        }
    })
}
export const getStaticProps: GetStaticProps = async () => {
    const pokemonsOrdered = await getOrderedPokemons()

    return {
        props: {
            pokemons: pokemonsOrdered,
        },
        revalidate: 60
    }
}

export default ResultsPage;