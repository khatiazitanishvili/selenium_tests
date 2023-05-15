const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');

async function example() {
    // Set up Firefox browser options
    const options = new firefox.Options();
    // options.setBinary('/Users/khatiazitanishvili/Desktop/geckodriver/geckodriver'); // Set the path to the Firefox binary if needed

    // Create a new WebDriver instance
    const driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();



    try {
        await driver.get('http://localhost:3000');
        // Test login dialog opening
        let loginBtn = await driver.findElement(By.linkText('Guest'));
        await loginBtn.click();
        await driver.findElement(By.linkText('login')).click();
        // Test login form submission with valid credentials
        let emailInput = await driver.findElement(By.id('formEmail'));
        await emailInput.sendKeys('john@some-host.de');
        let passwordInput = await driver.findElement(By.id('formPassword'));
        await passwordInput.sendKeys('1234');
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();


        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        // await driver.findElement(By.id("newChannel")).click();
        const newChannelLink = await driver.findElement(By.id('newChannel'));
        await newChannelLink.click();


        await driver.findElement(By.id('formName')).sendKeys('Test Channel');
        await driver.findElement(By.id('formDescription')).sendKeys('This is a test channel.');
        await driver.findElement(By.id('formPublic')).click();
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();
        await driver.wait(until.urlIs('http://localhost:3000/'));
        const channelCards = await driver.findElements(By.className('card-title'));
        const channelNames = await Promise.all(channelCards.map(async (card) => await card.getText()));
        assert(channelNames.includes('Test Channel'));


        // it('should display validation errors for invalid inputs', async function () {
        //     await driver.get('http://localhost:3000/channel/create');
        //     await driver.findElement(By.id('formName')).sendKeys('Test');
        //     await driver.findElement(By.id('formDescription')).sendKeys('Short description.');
        //     await driver.findElement(By.css('button[type="submit"]')).click();
        //     const errorMessages = await driver.findElements(By.css('.invalid-feedback'));
        //     const errorTexts = await Promise.all(errorMessages.map(async (error) => await error.getText()));
        //     assert(errorTexts.includes('Please enter at least 5 characters.'));
        // });

        // it('should cancel channel creation and return to homepage', async function () {
        //     await driver.get('http://localhost:3000/channel/create');
        //     await driver.findElement(By.css('button[type="button"]')).click();
        //     await driver.wait(until.urlIs('http://localhost:3000/'));
        // });

    } finally {
        await driver.quit();
    }
};
example()