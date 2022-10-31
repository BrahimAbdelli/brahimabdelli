/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // About section
    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="about"]').click();

    // The new url should include "/about"
    cy.url().should('include', 'about');

    // The new page should contain an h1 with "About page"
    cy.get('span').contains('ABOUT ME');
    cy.get('p').contains(
      'I have accumulated experience in designing, developing, testing and deploying web apps from scratch for 2 years.'
    );
    cy.get('p').contains(
      'I hold perticular interest in Javascript, Typescript and Java.'
    );
    cy.get('p').contains(
      'Also in optimization, enhancing app performance and SEO.'
    );
    cy.get('p').contains(
      "I'm a Full Stack developer with a passion for building web solutions. Coding is an activity i exercie everyday with passion."
    );
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
