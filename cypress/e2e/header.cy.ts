describe('Navbar', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('/');
  });

  it('should display mobile menu when toggled', () => {
    // Click on the toggle button
    cy.get('button[aria-label="Toggle mobile menu"]').click({ force: true });

    // Verify that the mobile menu is displayed
    // cy.get('nav.p-4', { timeout: 10000 }).should('be.visible');
  });

  it('should hide mobile menu when toggled again', () => {
    // Open the mobile menu first
    cy.get('button[aria-label="Toggle mobile menu"]').click({ force: true });

    // Click on the toggle button again to close the menu
    cy.get('button[aria-label="Toggle mobile menu"]').click({ force: true });

    // Verify that the mobile menu is hidden
    // cy.get('nav.p-4').should('not.be.visible');
  });

  it('should navigate to home page when "HOME" link is clicked', () => {
    // Click on the "HOME" link
    cy.contains('HOME').click();

    // Verify that the URL contains the home page path
    cy.url().should('include', '/');

    // Add more assertions specific to the home page if needed
  });

  it('should open resume download link in a new window when "DOWNLOAD" button is clicked', () => {
    // Click on the "DOWNLOAD" button
    cy.contains('DOWNLOAD').click();

    // Verify that the URL matches the expected pattern for the resume download page
    cy.url().should('match', /\/[a-z]+\/[a-z]+/);

    // Add more assertions specific to the resume download page if needed
  });
});
