import { IPokemonDetails, IPokemonMove, IPokemonSpecieResponse } from "@/types";
import { getPokemonMoves, mapSpecieResponse } from "../../../../utils";
import { capitalize } from "lodash";

describe('Pokemon Details', () => {
  let pokemonDetails = {} as IPokemonDetails;
  let pokemonSpecie = {} as IPokemonSpecieResponse;
  beforeEach(() => {
    cy.visit('http://localhost:4000/pokemon/pikachu');
    cy.fixture('pokemonDetails').then((data) => {
      pokemonDetails = data;
    });
    cy.fixture('pokemonSpecie').then((data) => {
      pokemonSpecie = data;
    });
  });

  it("should have a page title with pokémon's name", () => {
    cy.get('[data-cy="page-title"]').contains(`PokéNext - ${capitalize(pokemonDetails.name)}`);
  });

  it('should have a navbar', () => {
    cy.get('[data-cy="navbar"]').contains('PokéNext');
  });

  it('should navigate to "Home" page when clicking on navbar link', () => {
    cy.get('[data-cy="home-navigation-link"]').click();
    cy.location('pathname').should('eq', '/');
  });

  it("should have pokemon's name", () => {
    cy.get('[data-cy="pokemon-details-name"]').contains(pokemonDetails.name);
  });

  it("should have pokemon's id", () => {
    cy.get('[data-cy="pokemon-id"]').contains(pokemonDetails.id);
  });

  it("should have pokemon's image", () => {
    cy.get('[data-cy="pokemon-details-image"]').should('have.attr', 'src').should('to.match', /025.png/);
  });

  it("should have pokemon's animated gif", () => {
    cy.get('[data-cy="pokemon-details-animation"]').should('have.attr', 'src').should('to.match', /25.gif/);
  });

  it("should have pokemon's height", () => {
    cy.get('[data-cy="pokemon-details-height"]').contains(pokemonDetails.height * 10);
  });

  it("should have pokemon's weight", () => {
    cy.get('[data-cy="pokemon-details-weight"]').contains(pokemonDetails.weight / 10);
  });

  it("should have link to pokemon evolves from", () => {
    cy.get('[data-cy="pokemon-evolves-from"]').contains('a', 'Pichu');
  });

  it("should have link to pokemon evolves to", () => {
    cy.get('[data-cy="pokemon-evolves-to"]').contains('a', 'Raichu');
  });

  it("should have pokemon's about information", () => {
    const specieData = mapSpecieResponse(pokemonSpecie);
    cy.get('[data-cy="pokemon-details-about"]').contains(specieData.join(' '));
  });

  it("should have pokemon's moves", () => {
    cy.get('[data-cy="pokemon-details-moves"]').contains(getPokemonMoves(pokemonDetails.moves as unknown as IPokemonMove[]).join(', '));
  });
});