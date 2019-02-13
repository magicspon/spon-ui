describe('page navigation', () => {
	it('loads the right pages', () => {
		cy.visit('http://localhost:3000/components/preview/sandbox')
		cy.contains('page 2').click()

		cy.wait(1000)
		cy.url().should('include', '/components/preview/sandbox--2')
		cy.contains('page 3').click()

		cy.wait(1000)
		cy.url().should('include', '/components/preview/sandbox--3')
		cy.contains('page 4').click()

		cy.wait(1000)
		cy.url().should('include', '/components/preview/sandbox--4')

		cy.wait(1000)
		cy.go('back')
		cy.url().should('include', '/components/preview/sandbox--3')
	})
})
