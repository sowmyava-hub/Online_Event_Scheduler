package tests;
import java.time.Duration;
import org.openqa.selenium.JavascriptExecutor;

import java.util.List;
import java.util.concurrent.TimeUnit;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;


public class Test {
	
	
	public static void main(String[] args) throws InterruptedException {

		// TODO Auto-generated method stub

		System.setProperty("webdriver.chrome.driver", "C:\\Users\\bablo\\Downloads\\chromedriver_win32\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		
		driver.get("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/Signup");
		driver.findElement(By.id("name")).sendKeys("hello@abc.com");
		driver.findElement(By.id("password")).sendKeys("Database@55");
		driver.findElement(By.id("confirmpassword")).sendKeys("Database@55");
		driver.findElement(By.cssSelector("button[class='mt-3 btn btn-primary btn-block']")).click();
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/login");
		driver.findElement(By.id("email")).sendKeys("hello@abc.com");
		driver.findElement(By.id("password")).sendKeys("Database@55");
		driver.findElement(By.cssSelector("button[class='btn btn-primary btn-block']")).click();
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud");
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div/div/div[2]/a")).click();
		Thread.sleep(2000);
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/poll");
		driver.findElement(By.name("pollTitle")).sendKeys("Test Meet");
		driver.findElement(By.name("pollDescription")).sendKeys("Project Plan");
		driver.findElement(By.name("pollLocation")).sendKeys("Capen");
	
		
		By xpath1 = By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div/div[2]/div[2]/div[7]/div[49]");
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		WebElement element1 = wait.until(ExpectedConditions.elementToBeClickable(xpath1));
		element1.click();
		
		By xpath2 = By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div/div[2]/div[2]/div[8]/div[49]");
		WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
		WebElement element2 = wait2.until(ExpectedConditions.elementToBeClickable(xpath2));
		element2.click();
		
		//String valueToSend = "2023-05-04 09:30 PM";
//		inputElement.sendKeys(valueToSend);
		
		//Thread.sleep(15000);
		//JavascriptExecutor j = (JavascriptExecutor)driver;
	    //j.executeScript("arguments[0].value='" + valueToSend + "';", inputElement);
	    //System.out.println("Value entered is: " +inputElement.getAttribute("value"));
		
		
		driver.findElement(By.cssSelector("button[class='MuiButtonBase-root MuiIconButton-root']")).click();
		
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div[2]/div/div[1]/div[5]/button/span[1]/p")).click();


		//List<WebElement> times= driver.findElements(By.cssSelector("span[class='MuiTypography-root MuiPickersClockNumber-clockNumber MuiTypography-body1']"));
		
		//int count=driver.findElements(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div/div")).size();

		//for(int i=0;i<count;i++)
		//{
			//String text=driver.findElements(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div/div/span[9]")).get(i).getText();
			//if(text.equalsIgnoreCase("9"))
			//{
				//driver.findElements(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div/div/span[9]")).get(i).click();
				//break;
			//}
		//}
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[2]/button[3]/span[1]")).click();
		driver.findElement(By.cssSelector("button[class='global-primary-button btn btn-primary']")).click();
		
		//#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > ul
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/poll/64528cfcf24c4e2a4951e475");
		Thread.sleep(2000);
		
		driver.findElement(By.xpath("//*[@id='timezone-select']")).click();
		WebElement ele = driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]/ul/li[284]/span"));
		JavascriptExecutor executor = (JavascriptExecutor)driver;
		executor.executeScript("arguments[0].click();", ele);
		//driver.findElement(By.xpath("div[@class='MuiPaper-root MuiMenu-paper MuiPaper-elevation8 MuiPopover-paper MuiPaper-rounded']")).click();
		//Select dropdown = new Select(staticDropdown);
		//dropdown.selectByVisibleText("Asia/Jakarta");
		//driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]")).click();
		
		driver.findElement(By.id("{\"start\":1683262800000,\"end\":1683263700000,\"_id\":\"64528cfcf24c4e2a4951e476\"}")).click();
		int i =0;
		while(i<2)
		{
			driver.findElement(By.id("{\"start\":1683349200000,\"end\":1683350100000,\"_id\":\"64528cfcf24c4e2a4951e477\"}")).click();
			i++;
		}
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[3]/input")).sendKeys("Sanjay");
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[3]/button")).click();
		
		
		
	} 

}
