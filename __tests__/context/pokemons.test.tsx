import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { IPokemonContext, PokemonsProvider, usePokemonContext } from "@/context/pokemons";
import * as utils from "@/utils";

jest.mock('../../utils/index.ts', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../utils/index.ts')
  };
});

const POKEMON_LIST = 'test-pokemon-list';
const POKEMON_LIST_ELEMENT_CLASSNAME = 'test-pokemon-list-element';
const TEST_BUTTON_ID = 'test-button';
const LOADING_MESSAGE = 'test-loading-message';

const TestComponent = (): React.ReactElement => {
  const { pokemons, isLoading, loadMorePokemons } = usePokemonContext() as IPokemonContext;

  return (
    <div>
      <ul data-testid={POKEMON_LIST}>
        {pokemons.map(pokemon => (
          <li key={pokemon.id} className={POKEMON_LIST_ELEMENT_CLASSNAME}>
            {pokemon.id}
          </li>
        ))}
      </ul>
      <button data-testid={TEST_BUTTON_ID} onClick={loadMorePokemons}>
        Test Button
      </button>
      {isLoading && <span data-testid={LOADING_MESSAGE}>Loading...</span>}
    </div>  
  );
};

const renderTestComponent = () =>
  render(
    <PokemonsProvider>
      <TestComponent />
    </PokemonsProvider>
  );

describe('PokemonsProvider', () => {
  const fakeApiResponse1 = [
    {
      name: 'fake-name-1',
      id: 1,
      imageUrl: 'fake-image-url-1',
      animationUrl: 'fake-animation-url-1',
    }
  ];
  const fakeApiResponse2 = [
    {
      name: 'fake-name-2',
      id: 2,
      imageUrl: 'fake-image-url-2',
      animationUrl: 'fake-animation-url-2',
    }
  ];

  afterEach(() => {    
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(utils, 'fetchPokemons')
      .mockResolvedValueOnce(fakeApiResponse1)
      .mockResolvedValueOnce(fakeApiResponse2);
  });

  it('pokémons list should be empty by default', () => {
    const { container } = renderTestComponent();
    const pokemonsList = container.getElementsByClassName(POKEMON_LIST_ELEMENT_CLASSNAME);
    expect(pokemonsList.length).toEqual(0);
  });

  it('should call PokéAPI to load more pokemons with correct initial offset and limit values', async () => {
    renderTestComponent();
    await act(async () => {
      await fireEvent.click(screen.getByTestId(TEST_BUTTON_ID));
    });
    expect(utils.fetchPokemons).toHaveBeenCalledWith(151, 59);
  });

  it('should store load more pokemons result', async () => {
    renderTestComponent();
    await act(async () => {
      await fireEvent.click(screen.getByTestId(TEST_BUTTON_ID));
    });
    const pokemonsListElement = screen.getByTestId(POKEMON_LIST);
    expect(pokemonsListElement.childNodes.length).toEqual(1);
  });

  it('should increment offset and redefine limit after api call', async () => {
    renderTestComponent();
    await act(async () => {
      await fireEvent.click(screen.getByTestId(TEST_BUTTON_ID));
    });
    expect(utils.fetchPokemons).toHaveBeenNthCalledWith(1, 151, 59);
    await act(async () => {
      await fireEvent.click(screen.getByTestId(TEST_BUTTON_ID));
    });
    expect(utils.fetchPokemons).toHaveBeenNthCalledWith(2, 152, 60);
  });

  it('should set loading while fetching api', async () => {
    renderTestComponent();
    act(() => {
      fireEvent.click(screen.getByTestId(TEST_BUTTON_ID));
    });
    expect(screen.queryByText('Loading...')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeFalsy());
  });
});
