import { TRPCClientError } from '@trpc/client';
import { z } from 'zod';
import { procedure, router } from '../trpc';
import { prisma } from '../utils/db';

export const appRouter = router({
  getPokemonById: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const pokemon = await prisma.pokemon.findFirst({
        where: {
          id: input.id
        }
      })
      if (!pokemon) throw new TRPCClientError("Pokemon not found")
      return pokemon
    }),
  castVote: procedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number()
      })
    ).mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor
        }
      })
      return { success: true, vote: voteInDb }
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;