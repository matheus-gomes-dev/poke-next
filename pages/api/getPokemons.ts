// import { IGetPokemonsResponse, IPokemonGenericInformation } from '@/types';
// import { mapPokemonInformation } from '@/utils';
// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<IPokemonGenericInformation[]>
// ) {
//   const { offset, limit } = req.query;
//   const apiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon?offset=${offset}&limit=${limit}`);
//   const response = await apiResponse.json() as IGetPokemonsResponse;
//   const mappedResult = response.results.map(mapPokemonInformation);
//   res.status(200).json(mappedResult);
// }
