// https://docs.cypress.io/api/introduction/api.html

describe("360 App Test", () => {
  it("Pano Test", () => {
    cy.visit("/");
    console.log('Cypress.version', Cypress.version);
    cy.get('[data-test="sign-in-username-input"]').first().type("360testaccount");
    cy.get('[data-test="sign-in-password-input"]').first().should('not.be.disabled').type(`'V[U,&5/34fba.<Q?`, { force: true });
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.get('.d-flex > :nth-child(1)').click();
    cy.get(':nth-child(2) > .v-chip__content').click();

    function movePiece(x, y) {
      cy.get(`.pnlm-dragfix`)
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: x, clientY: y })
        .trigger('mouseup', { force: true })
    }
    movePiece(100, 100);
  });
});
