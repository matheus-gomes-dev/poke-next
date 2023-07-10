import * as utils from '@/utils';

global.fetch = jest.fn();

const fakeFetchPokemonsApiResponse = [
  {
    name: 'fake-pokemon-name-1',
    url: 'https://pokeapi.co/api/v2/pokemon/1/'
  },
  {
    name: 'fake-pokemon-name-2',
    url: 'https://pokeapi.co/api/v2/pokemon/2/'
  },
];

const fakePokemonDetailsApiResponse = {
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

const fakeSpecieApiResponse = {
  "evolution_chain": {
    "url": "https://pokeapi.co/api/v2/evolution-chain/4/"
  },
  "evolves_from_species": {
    "name": "metapod",
    "url": "https://pokeapi.co/api/v2/pokemon-species/11/"
  },
  "flavor_text_entries": [
    {
      "flavor_text": "In battle, it\nflaps its wings\nat high speed to\frelease highly\ntoxic dust into\nthe air.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "red",
        "url": "https://pokeapi.co/api/v2/version/1/"
      }
    },
    {
      "flavor_text": "Il raffole du nectar des fleurs. Il est capable de repérer la plus petite quantité de pollen.",
      "language": {
        "name": "fr",
        "url": "https://pokeapi.co/api/v2/language/5/"
      },
      "version": {
        "name": "white",
        "url": "https://pokeapi.co/api/v2/version/18/"
      }
    },
    {
      "flavor_text": "In battle, it\nflaps its wings\nat high speed to\frelease highly\ntoxic dust into\nthe air.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "blue",
        "url": "https://pokeapi.co/api/v2/version/2/"
      }
    },
    {
      "flavor_text": "Its wings, covered\nwith poisonous\npowders, repel\fwater. This\nallows it to fly\nin the rain.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "yellow",
        "url": "https://pokeapi.co/api/v2/version/3/"
      }
    },
    {
      "flavor_text": "It collects honey\nevery day. It rubs\nhoney onto the\fhairs on its legs\nto carry it back\nto its nest.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "gold",
        "url": "https://pokeapi.co/api/v2/version/4/"
      }
    },
    {
      "flavor_text": "Water-repellent\npowder on its\nwings enables it\fto collect honey,\neven in the heav­\niest of rains.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "silver",
        "url": "https://pokeapi.co/api/v2/version/5/"
      }
    },
    {
      "flavor_text": "It flits from\nflower to flower,\ncollecting honey.\fIt can even\nidentify distant\nflowers in bloom.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "crystal",
        "url": "https://pokeapi.co/api/v2/version/6/"
      }
    },
    {
      "flavor_text": "BUTTERFREE has a superior ability to\nsearch for delicious honey from\nflowers.\fIt can even search out, extract, and\ncarry honey from flowers that are\nblooming over six miles from its nest.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "ruby",
        "url": "https://pokeapi.co/api/v2/version/7/"
      }
    },
  ],
}
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

  describe('getPokemonDetails', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch')
        .mockReturnValueOnce(Promise.resolve({
          json: () => Promise.resolve(fakePokemonDetailsApiResponse),
        } as Response))
        .mockReturnValueOnce(Promise.resolve({
          json: () => Promise.resolve(fakeSpecieApiResponse),
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
      });
    });
  });
});