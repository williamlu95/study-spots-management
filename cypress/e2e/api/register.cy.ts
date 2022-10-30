import { v4 as uuid } from 'uuid';

const EXISTING_USER = {
  familyName: 'Don',
  givenName: 'Cheadle',
  email: `${uuid()}@email.com`,
  password: 'password',
};

describe('register', () => {
  it('registers a new user', () => {
    cy.request({
      method: 'POST',
      url: '/api/register',
      body: EXISTING_USER,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('fails if the same user registers again', () => {
    cy.request({
      method: 'POST',
      url: '/api/register',
      body: EXISTING_USER,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('fails if any field is missing', () => {
    Object.keys(EXISTING_USER).forEach((key) => {
      cy.request({
        method: 'POST',
        url: '/api/register',
        body: {
          ...EXISTING_USER,
          email: `${uuid()}@email.com`,
          [key]: undefined,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    cy.request({
      method: 'POST',
      url: '/api/register',
      body: EXISTING_USER,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
