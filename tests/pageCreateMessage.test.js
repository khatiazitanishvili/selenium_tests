const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');
const { log } = require('console');

describe("Create Message Tests", function () {
    let driver;
    before(async function () {
        const options = new firefox.Options();
        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    });

    after(async function () {
        await driver.quit();
    });

    // Reusable method for logging in
    async function login(email, password) {
        let loginBtn = await driver.findElement(By.linkText('Guest'));
        await loginBtn.click();
        await driver.findElement(By.linkText('login')).click();

        let emailInput = await driver.findElement(By.id('formEmail'));
        await emailInput.sendKeys(email);
        let passwordInput = await driver.findElement(By.id('formPassword'));
        await passwordInput.sendKeys(password);
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
    }
    it('should create a new message', async function () {
        await driver.get('http://localhost:3000');
        await login('john@some-host.de', '1234')


        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        const channelLink = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
        await channelLink.click();

        const newMessageLink = await driver.findElement(By.id('newMessage'));
        await newMessageLink.click();

        await driver.findElement(By.css('#formTitel')).sendKeys('Test Message');
        await driver.findElement(By.css('#formContent')).sendKeys('This is Test Messages Content');
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();

        await driver.sleep(1000); // Introduce a small delay (adjust the delay as needed)

        const messageCards = await driver.findElements(By.xpath(`//h3[contains(text(), "Test Message")]`));
        const messageNames = await Promise.all(messageCards.map(async (card) => await card.getText()));

        assert(messageNames.includes('Test Message'));
    });


    it('should handle message form submission with invalid inputs', async function () {
        await driver.get('http://localhost:3000');
        await login('john@some-host.de', '1234')

        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        const channelLink = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
        await channelLink.click();

        const newMessageLink = await driver.findElement(By.id('newMessage'));
        await newMessageLink.click();

        await driver.findElement(By.css('#formTitel')).sendKeys('Test');
        await driver.findElement(By.css('#formContent')).sendKeys('This is Test Messages Content');
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();

        // Wait for the form validation
        await driver.sleep(1000); // Wait for 1 second (adjust as needed)

        // Find all invalid form elements
        const invalidElements = await driver.findElements(By.css('input:invalid'));

        // Assert that the expected number of invalid elements is found
        assert.strictEqual(invalidElements.length, 1);

        // Example: Get the validation message of the first invalid element
        const firstInvalidElement = invalidElements[0];
        const validationMessage = await firstInvalidElement.getAttribute('validationMessage');
        assert.strictEqual(validationMessage, 'Please use at least 5 characters (you are currently using 4 characters).');
    })


    it('should cancel message creation and return to homepage', async function () {
        await driver.get('http://localhost:3000');
        await login('john@some-host.de', '1234')

        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        const channelLink = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
        await channelLink.click();

        const newMessageLink = await driver.findElement(By.id('newMessage'));
        await newMessageLink.click();

        await driver.findElement(By.css('#formTitel')).sendKeys('Test Message');
        await driver.findElement(By.css('#formContent')).sendKeys('This is Test Messages Content');

        await driver.findElement(By.xpath("//button[contains(text(), 'Cancel')]")).click();
    });
})