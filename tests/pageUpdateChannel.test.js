// const { Builder, By, Key, until } = require('selenium-webdriver');
// const assert = require('assert');
// const firefox = require('selenium-webdriver/firefox');
// describe("Update Channel Tests", function () {

//     it('should perform login and update a channel with valid inputs', async function () {
//         // Set up Firefox browser options
//         const options = new firefox.Options();

//         // Create a new WebDriver instance
//         const driver = await new Builder()
//             .forBrowser('firefox')
//             .setFirefoxOptions(options)
//             .build();



//         await driver.get('http://localhost:3000');

//         // Test login dialog opening
//         let loginBtn = await driver.findElement(By.linkText('Guest'));

//         await loginBtn.click();
//         await driver.findElement(By.linkText('login')).click();


//         // Test login form submission with valid credentials
//         let emailInput = await driver.findElement(By.id('formEmail'));
//         await emailInput.sendKeys('john@some-host.de');
//         let passwordInput = await driver.findElement(By.id('formPassword'));
//         await passwordInput.sendKeys('1234');
//         await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();
//         const overlayElement = await driver.findElement(By.css('.fade.modal'));
//         await driver.actions().move({ origin: overlayElement }).perform();

//         const element = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
//         await element.click();

//         const editChannel = await driver.findElement(By.id('editChannel'));
//         await editChannel.click();

//         await driver.findElement(By.id('formName')).sendKeys('Test Private Channel 0 Name update');
//         await driver.findElement(By.id('formDescription')).sendKeys('This is a Private Channel 0 update Description');
//         await driver.findElement(By.id('formPublic')).click();
//         await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();
//         // await driver.wait(until.urlIs('http://localhost:3000/'));


//         // Wait for the channel page to load
//         await driver.wait(until.elementLocated(By.css('h3')), 5000);

//         // Grab the element using the CSS selector
//         const nameElement = await driver.findElement(By.css('div.col > h3'));
//         const nameText = await nameElement.getText();

//         // Assert the text of the element
//         assert.strictEqual(nameText, 'Test Private Channel 0 Name update');
//         await driver.quit();

//     });
// });


const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');

describe("Update Channel Tests", function () {
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

    it('should perform login and update a channel', async function () {
        await driver.get('http://localhost:3000');

        let loginBtn = await driver.findElement(By.linkText('Guest'));
        await loginBtn.click();
        await driver.findElement(By.linkText('login')).click();

        let emailInput = await driver.findElement(By.id('formEmail'));
        await emailInput.sendKeys('john@some-host.de');
        let passwordInput = await driver.findElement(By.id('formPassword'));
        await passwordInput.sendKeys('1234');
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();

        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        const element = await driver.findElement(By.xpath('(//a[contains(text(), "View Channel")])[1]'));
        await element.click();

        const editChannel = await driver.findElement(By.id('editChannel'));
        await editChannel.click();

        await driver.findElement(By.id('formName')).sendKeys('Test Private Channel 0 Name update');
        await driver.findElement(By.id('formDescription')).sendKeys('This is a Private Channel 0 update Description');
        await driver.findElement(By.id('formPublic')).click();
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();

        await driver.wait(until.elementLocated(By.css('h3')), 5000);

        const nameElement = await driver.findElement(By.css('div.col > h3'));
        const nameText = await nameElement.getText();

        assert.strictEqual(nameText, 'Test Private Channel 0 Name update');
    });
});

