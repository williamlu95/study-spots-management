import { v4 as uuid } from 'uuid';

const EXISTING_USER = {
  familyName: 'Don',
  givenName: 'Cheadle',
  email: `${uuid()}@email.com`,
  password: 'password',
};

describe('authenticate', () => {
  before(() => {
    cy.request('POST', '/api/register', EXISTING_USER);
  });

  it('authenticates an existing user with the right password', () => {
    cy.request('POST', '/api/authenticate', {
      email: EXISTING_USER.email,
      password: EXISTING_USER.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('responds with bad request if the password is incorrect', () => {
    cy.request({
      method: 'POST',
      url: '/api/authenticate',
      body: {
        email: EXISTING_USER.email,
        password: 'wrong_password',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
