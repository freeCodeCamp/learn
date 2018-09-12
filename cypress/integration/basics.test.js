describe('Basic Tests', () => {
  it('Visits the the first challenge', () => {
    cy.visit('http://localhost:8000/');

    cy.contains('Say Hello to HTML Elements').click();

    cy.url()
      .should('include', 'basic-html-and-html5/say-hello-to-html-elements');
  });
});
