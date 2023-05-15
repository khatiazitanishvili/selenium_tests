
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
        // await driver.wait(until.elementIsVisible(loginModal), 5000);

        // Test login form submission with valid credentials
        let emailInput = await driver.findElement(By.id('formEmail'));
        await emailInput.sendKeys('john@some-host.de');
        let passwordInput = await driver.findElement(By.id('formPassword'));
        await passwordInput.sendKeys('1234');
        await driver.findElement(By.xpath("//button[contains(text(), 'Login')]")).click();

        const userDropdown = await driver.findElement(By.id('navbarScrollingDropdown'));
        const userDropdownText = await userDropdown.getText();
        assert.strictEqual(userDropdownText, "User")



    } finally {
        await driver.quit();
    }
}


example();

