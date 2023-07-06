describe('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.intercept('https://pokeapi.co/api/v2/pokemon?offset=151&limit=59').as('loadMorePokemons');
    cy.get('[data-cy="load-more-btn"]').as('loadMoreBtn');
  });

  it('should have a navbar', () => {
    cy.get('[data-cy="navbar"]').contains('PokéNext');
  });

  it('should render cards for all first generation pokémons', () => {
    cy.get('[data-cy="pokemon-card"]').should('have.length', 151);
  });

  it('should have a load more button', () => {
    cy.get('@loadMoreBtn').contains('Load more');
  });

  describe('when loading more pokémons', () => {
    it('should disable load more button while waiting for api response', () => {
      cy.intercept('@loadMorePokemons', () => {
        cy.get('@loadMoreBtn').should('be.disabled');
      });
      cy.get('@loadMoreBtn').click();
      cy.wait('@loadMorePokemons');
      cy.get('@loadMoreBtn').should('not.be.disabled');
    });

    it('should render new cards for each loaded pokémon', () => {
      cy.get('@loadMoreBtn').click();
      cy.wait('@loadMorePokemons');
      cy.get('[data-cy="pokemon-card"]').should('have.length', 210);
    });
  });
});