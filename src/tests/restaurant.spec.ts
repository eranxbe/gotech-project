import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { expect } from 'chai';
import restaurantsAPI from '../logic/REST/restaurantsAPI';


describe('Restaurants tests', () => {

    before('Reset restaurant server', async () => {
        //Arrange
        await restaurantsAPI.resetServer();
    })

    it('Validate the amount of restaurants', async () => {
        //Act
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();

        //Assert
        expect(restaurants.success).to.be.true;
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected');
    })

    it('Get restaurant by id', async () => {
        //Arrange
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest); // redundant variable assing?

        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(myNewRest);
    })

    it('Get non exsisting restaurant', async () => {
        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(2355);

        //Assert
        expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Add, Edit, Delete restaurant', async () => {
        // add //
        const eransId = 555;
        const eransRestaurant = { address: "Eran's address", id: eransId, name: "Eran's Restaurant", score: 4.5 };
        
        await restaurantsAPI.createRestaurant(eransRestaurant);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(eransId);

        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.data).to.deep.equal(eransRestaurant);

        // edit //

        const editResponse = await restaurantsAPI.editRestaurantPropertyById(eransId, 'score', 5.0);
        expect(editResponse.status).to.equal(200);
        expect(editResponse.success).to.be.true;

        // delete //

        const deleteResponse = await restaurantsAPI.deleteRestaurantById(eransId);
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.success).to.be.true;
    })

    it('Try deleting and editing non-existing restaurant', async () => {
        const fakeId = 666;
        const editResponse = await restaurantsAPI.editRestaurantPropertyById(fakeId);
        expect(editResponse.status).to.equal(404);
        expect(editResponse.success).to.be.false;
        expect(editResponse.error).to.equal('restaurant with given id not found');

        const deleteResponse = await restaurantsAPI.deleteRestaurantById(fakeId);
        expect(deleteResponse.status).to.equal(404);
        expect(deleteResponse.success).to.be.false;
        expect(deleteResponse.error).to.equal('restaurant with given id not found');
    })

    it('Create/Delete restaurant and validate count of restaurants', async () => {
        const eransId = 555;
        const eransRestaurant = { address: "Eran's address", id: eransId, name: "Eran's Restaurant", score: 4.5 };
        let count: number | undefined;

        const restaurantsInitial: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        count = restaurantsInitial.data?.length;
        expect(count).to.equal(4, 'Restaurants amount is not as expected');

        
        await restaurantsAPI.createRestaurant(eransRestaurant);
        const restaurantsAdded: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        count = restaurantsAdded.data?.length;
        expect(count).to.equal(5, 'Restaurants amount is not as expected');

        await restaurantsAPI.deleteRestaurantById(eransId);
        const restaurantsDeleted: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        count = restaurantsDeleted.data?.length;
        expect(count).to.equal(4, 'Restaurants amount is not as expected');
    })
})