import * as utils from '@/utils';
import fakeFetchPokemonsApiResponse from '../mocks/fetchPokemonsResponse.json';
import fakePokemonDetailsApiResponse from '../mocks/pokemonDetailsResponse.json';
import fakeSpecieApiResponse from '../mocks/pokemonSpecieResponse.json';
import pikachuEvolutionChain from '../mocks/pikachuEvolutionChainResponse.json';
import caterpieEvolutionChain from '../mocks/caterpieEvolutionChainResponse.json';
import eeveeEvolutionChain from '../mocks/eeveeEvolutionChainResponse.json';


global.fetch = jest.fn();

describe('utils', () => {
  describe('getPokemonAssets', () => {
    it('should return different urls for high quality image and gif when id <= 649', () => {
      const result = utils.getPokemonAssets(30);
      expect(result.imageUrl).toEqual(`${process.env.POKEMON_IMAGES_URL}/030.png`);
      expect(result.animationUrl).toEqual(`${process.env.POKEMON_ANIMATED_GIF_URL}/30.gif`);
    });

    it('should return the same url for high quality image when id > 649', () => {
      const result = utils.getPokemonAssets(650);
      expect(result.imageUrl).toEqual(`${process.env.POKEMON_IMAGES_URL}/650.png`);
      expect(result.animationUrl).toEqual(`${process.env.POKEMON_IMAGES_URL}/650.png`);
    });

    it('should return the same url for low quality image when id > 905', () => {
      const result = utils.getPokemonAssets(906);
      expect(result.imageUrl).toEqual(`${process.env.POKEMON_IMAGES_LOW_QUALITY_URL}/906.png`);
      expect(result.animationUrl).toEqual(`${process.env.POKEMON_IMAGES_LOW_QUALITY_URL}/906.png`);
    });

    it('should return question-mark image url when id = 10153', () => {
      const result = utils.getPokemonAssets(10158);
      expect(result.imageUrl).toEqual('/question-mark.png');
      expect(result.animationUrl).toEqual('/question-mark.png');
    });

    it('should return question-mark image url when id = 10154', () => {
      const result = utils.getPokemonAssets(10158);
      expect(result.imageUrl).toEqual('/question-mark.png');
      expect(result.animationUrl).toEqual('/question-mark.png');
    });

    it('should return question-mark image url when id > 10157', () => {
      const result = utils.getPokemonAssets(10158);
      expect(result.imageUrl).toEqual('/question-mark.png');
      expect(result.animationUrl).toEqual('/question-mark.png');
    });
  });

  describe('mapPokemonInformation', () => {
    const fakePokemonGenericResult = {
      name: 'fake-name',
      url: 'https://pokeapi.co/api/v2/pokemon/23/',
    }
    it('should map pokemon information returning name, id, imageUrl and animationUrl', () => {
      const result = utils.mapPokemonInformation(fakePokemonGenericResult);
      expect(result).toEqual({
        name: 'fake-name',
        id: 23,
        imageUrl: `${process.env.POKEMON_IMAGES_URL}/023.png`,
        animationUrl: `${process.env.POKEMON_ANIMATED_GIF_URL}/23.gif`,
      });
    });
  });

  describe('fetchPokemons', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockReturnValue(Promise.resolve({
        json: () => Promise.resolve(
          {
            results: fakeFetchPokemonsApiResponse,
          },
        ),
      } as Response));
    });

    it('should call PokéAPI to fetch pokemons generic information, according to offset and limit values', async () => {
      await utils.fetchPokemons(0, 2);
      expect(global.fetch).toHaveBeenCalledWith(`${process.env.POKE_API_URL}/pokemon?offset=0&limit=2`);
    });

    it('should return mapped pokemons generic information', async () => {
      const response = await utils.fetchPokemons(0, 2);
      expect(response).toEqual(fakeFetchPokemonsApiResponse.map(utils.mapPokemonInformation));
    });
  });

  describe('mapSpecieResponse', () => {
    const result = utils.mapSpecieResponse(fakeSpecieApiResponse);
    it('should remove "\n" and "\f" characters from text entries', () => {
      const charsRemoved = !result.some(text => text.includes('\n') || text.includes('\f'));
      expect(charsRemoved).toEqual(true);
    });

    it('should filter out entries that are not on english language', () => {
      const nonEnglishLanguageText = fakeSpecieApiResponse.flavor_text_entries.findIndex(entry => entry.language.name === 'fr');
      const hasNonEnglishLanguageText = result.some(text => text === fakeSpecieApiResponse.flavor_text_entries[nonEnglishLanguageText].flavor_text);
      expect(hasNonEnglishLanguageText).toEqual(false);
    });

    it('should keep only 3 entries as result', () => {
      expect(result.length).toEqual(3);
    });

    it('should not have duplicated entries', () => {
      expect(result[0]).not.toEqual(result[1]);
      expect(result[0]).not.toEqual(result[2]);
      expect(result[1]).not.toEqual(result[2]);
    });
  });

  describe('getEvolutionChain', () => {
    it("should map Pikachu's evolution chain correctly", () => {
      const result = utils.getEvolutionChain(pikachuEvolutionChain.chain);
      expect(result).toEqual({
        name: "pichu",
        id: 172,
        evolvesTo: [
          {
            name: "pikachu",
            id: 25,
            evolvesTo: [
              {
                name: "raichu",
                id: 26,
                evolvesTo: []
              }
            ]
          }
        ]
      });
    });

    it("should map eevee's evolution chain correctly", () => {
      const result = utils.getEvolutionChain(eeveeEvolutionChain.chain);
      console.log(JSON.stringify(result));
      expect(result).toEqual({
        name: "eevee",
        id: 133,
        evolvesTo: [
          {
            name: "vaporeon",
            id: 134,
            evolvesTo: []
          },
          {
            name: "jolteon",
            id: 135,
            evolvesTo: []
          },
          {
            name: "flareon",
            id: 136,
            evolvesTo: []
          },
          {
            name: "espeon",
            id: 196,
            evolvesTo: []
          },
          {
            name: "umbreon",
            id: 197,
            evolvesTo: []
          },
          {
            name: "leafeon",
            id: 470,
            evolvesTo: []
          },
          {
            name: "glaceon",
            id: 471,
            evolvesTo: []
          },
          {
            name: "sylveon",
            id: 700,
            evolvesTo: []
          }
        ]
      });
    });
  });

  describe('getPokemonDetails', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch')
        .mockReturnValueOnce(Promise.resolve({
          json: () => Promise.resolve(fakePokemonDetailsApiResponse),
        } as Response))
        .mockReturnValueOnce(Promise.resolve({
          json: () => Promise.resolve(fakeSpecieApiResponse),
        } as Response))
        .mockReturnValueOnce(Promise.resolve({
          json: () => Promise.resolve(caterpieEvolutionChain),
        } as Response));
    });

    it('should call PokéAPI to fetch individual pokemon details using id', async () => {
      await utils.getPokemonDetails(12);
      expect(global.fetch).toHaveBeenCalledWith(`${process.env.POKE_API_URL}/pokemon/12`);
    });

    it('should call PokéAPI to fetch individual pokemon details using name', async () => {
      await utils.getPokemonDetails('butterfree');
      expect(global.fetch).toHaveBeenCalledWith(`${process.env.POKE_API_URL}/pokemon/butterfree`);
    });

    it('should convert weight to kilograms', async () => {
      const response = await utils.getPokemonDetails('butterfree');
      expect(response.weight).toEqual(32);
    });

    it('should convert height to centimeters', async () => {
      const response = await utils.getPokemonDetails('butterfree');
      expect(response.height).toEqual(110);
    });

    it("should map pokemon's types", async () => {
      const response = await utils.getPokemonDetails('butterfree');
      expect(response.types).toEqual(['bug', 'flying']);
    });

    it("should map pokemon's known moves (level_learned_at > 0)", async () => {
      const response = await utils.getPokemonDetails('butterfree');
      expect(response.moves).toEqual(['bug-bite', 'sleep powder']);
    });

    it("should return pokemon's mapped information", async () => {
      const response = await utils.getPokemonDetails('butterfree');
      expect(response).toEqual({
        name: 'butterfree',
        id: 12,
        weight: 32,
        height: 110,
        moves: ['bug-bite', 'sleep powder'],
        types: ['bug', 'flying'],
        imageUrl: `${process.env.POKEMON_IMAGES_URL}/012.png`,
        animationUrl: `${process.env.POKEMON_ANIMATED_GIF_URL}/12.gif`,
        about: utils.mapSpecieResponse(fakeSpecieApiResponse),
        evolvesFrom: {
          id: 11,
          name: 'metapod',
        },
        evolvesTo: [],
      });
    });
  });
});