import { v4 as uuid } from 'uuid';

const EXISTING_STUDY_SPOT = {
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

describe('[studySpotId]', () => {
  let studySpotId: string;

  before(() => {
    cy.request('POST', '/api/study-spots', EXISTING_STUDY_SPOT).then(
      (response) => {
        studySpotId = response.body._id;
      },
    );
  });

  it('updates the study spot', function () {
    cy.request({
      method: 'PUT',
      url: `/api/study-spots/${studySpotId}`,
      body: {
        ...EXISTING_STUDY_SPOT,
        seating: 'plenty',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.seating).to.eq('plenty');
    });
  });

  it('deletes the study spot', function () {
    cy.request({
      method: 'DELETE',
      url: `/api/study-spots/${studySpotId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

    cy.request({
      method: 'GET',
      url: `/api/study-spots`,
    }).then((response) => {
      expect(
        response.body.map(({ name }: { name: string }) => name),
      ).to.not.contain(EXISTING_STUDY_SPOT.name);
    });
  });
});
