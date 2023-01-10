import { trpc } from "@/utils/trpc"

export default function Home() {
  const { data, isLoading } = trpc.hello.useQuery({ text: 'Nicolas' })
  if (isLoading) return <div>Loading...</div>
  return (
    <>
      {data?.greeting}
      {/* <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="text-2xl text-center">
          Which Pokemon is Roundest?
        </div>
        <div className="p-2" />
        <div className="border rounded p-8 flex justify-between max-w-2xl items-center">
          <div className="w-16 h-16 bg-red-200"></div>
          <div className="p-8">Vs.</div>
          <div className="w-16 h-16 bg-red-200"></div>
        </div>
      </div> */}
    </>
  )
}
