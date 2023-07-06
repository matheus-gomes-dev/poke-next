import * as utils from '@/utils';

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
    const fakeApiResponse = [
      {
        name: 'fake-pokemon-name-1',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      },
      {
        name: 'fake-pokemon-name-2',
        url: 'https://pokeapi.co/api/v2/pokemon/2/'
      },
    ];

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockReturnValue(Promise.resolve({
        json: () => Promise.resolve(
          {
            results: fakeApiResponse,
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
      expect(response).toEqual(fakeApiResponse.map(utils.mapPokemonInformation));
    });
  });

  describe('getPokemonDetails', () => {
    const fakeApiResponse = {
      "name": "butterfree",
      "id": 12,
      "weight": 320,
      "height": 11,
      "moves": [
        {
          "move": {
            "name": "bug-bite",
            "url": "https://pokeapi.co/api/v2/move/450/"
          },
          "version_group_details": [
            {
              "level_learned_at": 0,
            },
            {
              "level_learned_at": 1,
            }
          ]
        },
        {
          "move": {
            "name": "sleep powder",
            "url": "https://pokeapi.co/api/v2/move/333/"
          },
          "version_group_details": [
            {
              "level_learned_at": 1,
            },
            {
              "level_learned_at": 0,
            }
          ]
        },
        {
          "move": {
            "name": "tackle",
            "url": "https://pokeapi.co/api/v2/move/543/"
          },
          "version_group_details": [
            {
              "level_learned_at": 0,
            },
            {
              "level_learned_at": 0,
            }
          ]
        },
      ],
      "types": [
        {
          "slot": 1,
          "type": {
            "name": "bug",
            "url": "https://pokeapi.co/api/v2/type/7/"
          }
        },
        {
          "slot": 2,
          "type": {
            "name": "flying",
            "url": "https://pokeapi.co/api/v2/type/3/"
          }
        }
      ]
    };

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockReturnValue(Promise.resolve({
        json: () => Promise.resolve(fakeApiResponse),
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
      });
    });
  });
});