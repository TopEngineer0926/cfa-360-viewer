// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    console.log('Cypress.version', Cypress.version)
    cy.get('[data-test="sign-in-username-input"]').first().type("360testaccount");
    cy.get('[data-test="sign-in-password-input"]').first().type(`'V[U,&5/34fba.<Q?`);
    cy.get('[data-test="sign-in-sign-in-button"]').first().click()
  });
});
