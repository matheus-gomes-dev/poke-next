describe('About Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/about');
  });

  it('should have a navbar', () => {
    cy.get('[data-cy="navbar"]').contains('PokéNext');
  });

  it('should navigate to "Home" page when clicking on navbar link', () => {
    cy.get('[data-cy="home-navigation-link"]').click();
    cy.location('pathname').should('eq', '/');
  });

  it("should have Professor Oak picture", () => {
    cy.get('[data-cy="professor-oak-img"]').should('have.attr', 'src').should('to.match', /professor-oak.png/);
  });

  describe('first text section', () => {
    it("should have a link to Next.js documentation", () => {
      cy.get('[data-cy="about-section-0"]').find('a').eq(0)
        .should('have.attr', 'href', 'https://nextjs.org/')
    });

    it("should have a link to Matheus Gomes's LinkedIn", () => {
      cy.get('[data-cy="about-section-0"]').find('a').eq(1)
        .should('have.attr', 'href', 'https://www.linkedin.com/in/matheus-lima-923501a8/')
    });
  });

  describe('second text section', () => {
    it("should have a link to PokéAPI documentation", () => {
      cy.get('[data-cy="about-section-1"]').find('a').eq(0)
        .should('have.attr', 'href', 'https://pokeapi.co/')
    });
  });

  describe('third text section', () => {
    it("should have a link to Pokénext's public repository", () => {
      cy.get('[data-cy="about-section-2"]').find('a').eq(0)
        .should('have.attr', 'href', 'https://github.com/matheus-gomes-dev/poke-next')
    });
  });
});