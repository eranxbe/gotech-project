import { Page } from "playwright";
import { PageBase } from "./page-base";

const CREATE_NEW_RESTURANT_BUTTON = "//button[contains(text(),'Create new')]";
const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]";
const TEXT_ID = 'input[id="id"]';
const TEXT_NAME = 'input[id="name"]';
const TEXT_ADDRESS = 'input[id="address"]';
const TEXT_SCORE = 'input[id="score"]';
const BUTTON_SUBMIT = "//button[contains(text(),'Submit')]";
const BUTTON_OK = "//button[contains(text(), 'OK')]";
const LABEL_CREATED = "//h2[contains(text(),'Created!')]"
const RESTURANT_NAME_LOCATOR = '//tbody/tr/td[contains(text(), "XXX")]';
const RESTURANT_ROWS_LOCATOR = 'table[class="table table-striped"] tbody tr'

export class RestaurantPage extends PageBase {

    constructor(page: Page) {
        super(page);
    }

    clickCreateNewRestaurantButton = async () => {
        await this.page.click(CREATE_NEW_RESTURANT_BUTTON);
    }
    checkIfTitleInPopupExist = async () => {
        return await this.page.isVisible(POPUP_TITLE);
    }

    clickOkInPopup = async () => {
        await this.page.click(BUTTON_OK);
    }

    createNewResturant = async (id: string, name: string, address: string, score: string) => {
        await this.clickCreateNewRestaurantButton();
        await this.page.fill(TEXT_ID, id, {force: true});
        await this.page.fill(TEXT_NAME, name, {force: true});
        await this.page.fill(TEXT_ADDRESS, address, {force: true});
        await this.page.fill(TEXT_SCORE, score, {force: true});
        await this.page.click(BUTTON_SUBMIT, {force: true});
        await this.page.waitForSelector(LABEL_CREATED);
        await this.clickOkInPopup();
        
    }

    checkIfResturantExists = async (restaurantName: string) => {
        await this.page.waitForTimeout(2000);
        return await this.page.isVisible(RESTURANT_NAME_LOCATOR.replace('XXX', restaurantName));
    }

    deleteResturant = async (restaurantName: string) => {
        let rows = await this.page.locator(RESTURANT_ROWS_LOCATOR).all();
        for (let row of rows) {
            if (await row.locator('td').nth(2).innerText() === restaurantName) {
                await row.locator('button:has-text("X")').click({force: true});
            }
            else {
                continue;
            }
        }
        await this.clickOkInPopup();
    }

    
}