import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { useMemo, useState } from "react"

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote())
  const [first, second] = ids
  const firstPokemon = trpc.getPokemonById.useQuery({ id: first })
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second })

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">
          Which Pokemon is Roundest?
        </div>
        <div className="p-2" />
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <div className="w-64 h-64 flex flex-col">{firstPokemon.isLoading ? 'Loading Pokemon... ' : (
            <img src={firstPokemon.data?.sprites.front_default as string} alt={firstPokemon.data?.name} className="w-full" />
          )}
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {firstPokemon.data?.name}
            </div>
          </div>
          <div className="p-8">Vs.</div>
          <div className="w-64 h-64 flex flex-col">{secondPokemon.isLoading ? 'Loading Pokemon...' : (
            <img src={secondPokemon.data?.sprites.front_default as string} alt={secondPokemon.data?.name} className="w-full" />
          )}
            <div className="text-xl text-center capitalize mt-[-2rem]">
              {secondPokemon.data?.name}
            </div>
          </div>
          <div className="p-2" />
        </div>
      </div>
    </>
  )
}
