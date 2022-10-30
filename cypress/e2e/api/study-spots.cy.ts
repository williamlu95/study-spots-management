import { v4 as uuid } from 'uuid';

const STUDY_SPOT = {
  name: `Study Spot ${uuid()}`,
  seating: 'none',
  address: {
    street: '123 Main St.',
    city: 'Las Vegas',
    state: 'NV',
    zipCode: '89107',
    country: 'USA',
  },
  food: {
    pricing: 'low',
    quality: 'high',
  },
  drinks: {
    pricing: 'low',
    quality: 'high',
  },
  hasOutlets: false,
  hasBathroom: true,
  hasWifi: true,
};

describe('study-spots', () => {
  it('responds with bad request if a field is invalid', () => {
    cy.request({
      method: 'POST',
      url: '/api/study-spots',
      body: {
        ...STUDY_SPOT,
        seating: 'some invalid',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('creates the new study spot', () => {
    cy.request('POST', '/api/study-spots', STUDY_SPOT).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('gets the previously created study spot', () => {
    cy.request({
      method: 'GET',
      url: '/api/study-spots',
    }).then((response) => {
      expect(
        response.body.map(({ name }: { name: string }) => name),
      ).to.contain(STUDY_SPOT.name);
    });
  });
});
