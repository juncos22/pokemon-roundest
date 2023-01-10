import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { useMemo, useState } from "react"
import { inferQueryResponse } from "./api/trpc/[trpc]"

const btnClass = "inline-flex items-center px-2.5 py-1.5 font-medium text-md rounded border m-auto border-gray-300 shadow-sm bg-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700"

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote())
  const [first, second] = ids
  const firstPokemon = trpc.getPokemonById.useQuery({ id: first })
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second })
  const voteMutation = trpc.castVote.useMutation()

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({
        votedFor: first,
        votedAgainst: second
      })
    } else {
      voteMutation.mutate({
        votedFor: second,
        votedAgainst: first
      })
    }
    
    setIds(getOptionsForVote())
  }
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">
          Which Pokemon is Roundest?
        </div>
        <div className="p-2" />
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          {
            firstPokemon.isLoading
              ? 'Loading Pokemon...'
              : (
                <PokemonListing
                  pokemon={firstPokemon.data!}
                  vote={() => voteForRoundest(first)} />
              )
          }
          <div className="p-8">Vs.</div>
          {
            secondPokemon.isLoading
              ? 'Loading Pokemon...'
              : (
                <PokemonListing
                  pokemon={secondPokemon.data!}
                  vote={() => voteForRoundest(second)} />
              )
          }
          <div className="p-2" />
        </div>
      </div>
    </>
  )
}

type PokemonFromServer = inferQueryResponse<"getPokemonById">;
const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = (props) => {
  return (
    <div className="w-64 h-64 flex flex-col mb-3">
      <img src={props.pokemon.sprites.front_default as string} alt={props.pokemon.name} className="w-full" />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btnClass} onClick={() => props.vote()}>
        Vote Roundest
      </button>
    </div>
  )
}