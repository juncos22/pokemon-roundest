import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { useMemo, useState } from "react"
import { inferQueryResponse } from "./api/trpc/[trpc]"
import Image from "next/image"
import Link from "next/link"

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
              ? <span className="loader"></span>
              : (
                <PokemonListing
                  pokemon={firstPokemon.data!}
                  vote={() => voteForRoundest(first)} />
              )
          }
          <div className="p-8">Vs.</div>
          {
            secondPokemon.isLoading
              ? <span className="loader"></span>
              : (
                <PokemonListing
                  pokemon={secondPokemon.data!}
                  vote={() => voteForRoundest(second)} />
              )
          }
          <div className="p-2" />
        </div>
        <div className="absolute bottom-0 w-full text-2xl text-center pb-2">
          <Link href={'/results'}>View Results</Link>
        </div>
      </div>
    </>
  )
}

type PokemonFromServer = inferQueryResponse<"getPokemonById">;
const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = (props) => {
  return (
    <div className="w-64 h-64 flex flex-col mb-3">
      <Image
        width={100} height={100}
        src={props.pokemon.spriteUrl}
        alt={props.pokemon.name} className="w-full" />

      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>

      <button className={btnClass} onClick={() => props.vote()}>
        Vote Roundest
      </button>
    </div>
  )
}