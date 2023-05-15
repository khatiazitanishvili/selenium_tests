const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const firefox = require('selenium-webdriver/firefox');

describe("Create Channel Tests", function () {
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
    it('should perform login and create a new channel with valid inputs', async function () {
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

        //Perform some action after login(e.g., handle overlay)
        const overlayElement = await driver.findElement(By.css('.fade.modal'));
        await driver.actions().move({ origin: overlayElement }).perform();

        //Click on the new channel link to create a new channel
        const newChannelLink = await driver.findElement(By.id('newChannel'));
        await newChannelLink.click();

        await driver.findElement(By.id('formName')).sendKeys('Test channel 1');
        await driver.findElement(By.id('formDescription')).sendKeys('This is a test channel.');
        await driver.findElement(By.id('formPublic')).click();
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();

        //Wait for the URL to be the homepage URL after successful channel creation
        await driver.wait(until.urlIs('http://localhost:3000/'));
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await sleep(1000); // Introduce a small delay (adjust the delay as needed)
        //Verify that the created channel appears on the homepage
        const channelCards = await driver.findElements(By.xpath(`//h3[contains(text(), "Test channel 1")]`));
        const channelNames = await Promise.all(channelCards.map(async (card) => await card.getText()));
        // console.log('Channel Names:', channelNames); // Add this line to log the channel names

        assert(channelNames.includes('Test channel 1'));

    });


    it('should handle channel form submission with invalid inputs', async function () {
        await driver.get('http://localhost:3000/channel/create');

        await driver.findElement(By.id('formName')).sendKeys('Test');
        await driver.findElement(By.id('formDescription')).sendKeys('Invalid Channel Name');
        await driver.findElement(By.id('formPublic')).click();
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

    });

    it('should cancel channel creation and return to homepage', async function () {
        await driver.get('http://localhost:3000/channel/create');
        await driver.findElement(By.xpath("//button[contains(text(), 'Cancel')]")).click();
        // await driver.wait(until.urlIs('http://localhost:3000/'));

    });

});




