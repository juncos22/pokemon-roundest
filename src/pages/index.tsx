import { getOptionsForVote } from "@/utils/getRandomPokemon"
import { trpc } from "@/utils/trpc"
import { useMemo, useState } from "react"

export default function Home() {
  const [ids, setIds] = useState(() => getOptionsForVote())
  const [first, second] = ids
  const firstPokemon = trpc.getPokemonById.useQuery({ id: first })
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second })

  const btnClass = "inline-flex items-center px-2.5 py-1.5 font-medium text-md rounded border m-auto border-gray-300 shadow-sm bg-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700"
  const voteForRoundest = (selected: number) => {
    console.log('Voted', selected);

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
                <div className="w-64 h-64 flex flex-col">
                  <img src={firstPokemon.data?.sprites.front_default as string} alt={firstPokemon.data?.name} className="w-full" />
                  <div className="text-xl text-center capitalize mt-[-3rem]">
                    {firstPokemon.data?.name}
                  </div>
                  <button className={btnClass} onClick={() => voteForRoundest(first)}>Vote Roundest</button>
                </div>
              )
          }
          <div className="p-8">Vs.</div>
          {
            secondPokemon.isLoading
              ? 'Loading Pokemon...'
              : (
                <div className="w-64 h-64 flex flex-col">
                  <img src={secondPokemon.data?.sprites.front_default as string} alt={secondPokemon.data?.name} className="w-full" />
                  <div className="text-xl text-center capitalize mt-[-3rem]">
                    {secondPokemon.data?.name}
                  </div>
                  <button className={btnClass} onClick={() => voteForRoundest(second)}>Vote Roundest</button>
                </div>
              )
          }
          <div className="p-2" />
        </div>
      </div>
    </>
  )
}
