const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');

describe("Update Message Tests", function () {
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

    it('should perform login and update a message', async function () {
        await driver.get('http://localhost:3000');
        await login('john@some-host.de', '1234');

        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        const channelElement = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
        await channelElement.click();

        const editMessage = await driver.findElement(By.xpath('(//button[contains(text(), "Edit Message")])[1]'));
        await editMessage.click();


        await driver.findElement(By.css('#formTitel')).sendKeys('Test Message Update');
        await driver.findElement(By.css('#formContent')).sendKeys('This is Test Messages Content Update');
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();

        await driver.sleep(1000); // Introduce a small delay (adjust the delay as needed)

        const messageCards = await driver.findElements(By.xpath(`//h3[contains(text(), "Test Message Update")]`));
        const messageNames = await Promise.all(messageCards.map(async (card) => await card.getText()));

        assert(messageNames.includes('Test Message Update'));
    });
});

