import { expect } from 'chai';
import { RestaurantPage } from '../logic/pages/restaurant-page';
import { BrowserWrapper } from '../infra/browser/browser';
import configJson from '../../config.json';
import restaurantsAPI from '../logic/REST/restaurantsAPI';


describe('UI tests', () => {
    let browser: BrowserWrapper;
    let resturantPage: RestaurantPage;
    let restaurantId: string = '12345';
    let restaurantName: string = "Eran's restaurant";
    let restaurantAddress: string = "Eran's Address 123";
    let restaurantScore: string = '4.8'

    before('Reset restaurant server', async () => {
        await restaurantsAPI.resetServer();
    })

    beforeEach('Start browser', async () => {
        browser = new BrowserWrapper();
        resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl);
    })

    afterEach('Close browser', async () => {
        await browser.close();
    })

    it('Validate "Create new Restaurant Popup" opened', async () => {
        await resturantPage.clickCreateNewRestaurantButton();
        let actualResult = await resturantPage.checkIfTitleInPopupExist();
        expect(actualResult, 'Restaurants popup was not opened').to.be.true;
    })

    it('Create and delete restaurant', async () => {
        await resturantPage.createNewResturant(restaurantId, restaurantName, restaurantAddress, restaurantScore);
        expect(await resturantPage.checkIfResturantExists(restaurantName)).to.be.true;

        await resturantPage.deleteResturant(restaurantName);
        expect(await resturantPage.checkIfResturantExists(restaurantName)).to.be.false;
    })

})


