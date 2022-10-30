describe('logout', () => {
  it('logs out a user', () => {
    cy.request({
      method: 'GET',
      url: '/api/logout',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
