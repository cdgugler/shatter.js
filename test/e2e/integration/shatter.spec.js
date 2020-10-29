context('Shatter', () => {
    it('should compare original screenshot of squares', () => {
        cy.visit('http://localhost:8080/squares.html');
        cy.matchImageSnapshot('squares');
    });
});
