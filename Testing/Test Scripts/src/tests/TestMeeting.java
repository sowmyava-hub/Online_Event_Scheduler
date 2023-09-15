package tests;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestMeeting {

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
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/meeting");
		driver.findElement(By.name("pollTitle")).sendKeys("Test Meet");
		driver.findElement(By.name("pollDescription")).sendKeys("Project Plan");
		driver.findElement(By.name("pollLocation")).sendKeys("Capen");
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[1]/div[1]/div[4]/div/div/label")).click();

		Thread.sleep(2000);
		driver.findElement(By.xpath("//*[@id='timezone-select']")).click();
		WebElement ele = driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]/ul/li[2]/span"));
		JavascriptExecutor executor = (JavascriptExecutor)driver;
		executor.executeScript("arguments[0].click();", ele);
		//String value ="Weekly"; 
		//WebElement dropdown = driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]/ul"));
		
		//System.out.println(dropdown);
		//dropdown.click(); // assuming you have to click the "dropdown" to open it
		//w.until(ExpectedConditions.visibilityOfElementLocated (By.linkText("Wait")));
		//dropdown.findElement(By.cssSelector("li[value=" + value + "]")).click();
		
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
		
		By xpath1 = By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div/div[2]/div[2]/div[7]/div[49]");
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		WebElement element1 = wait.until(ExpectedConditions.elementToBeClickable(xpath1));
		element1.click();
		
		By xpath2 = By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div/div[2]/div[2]/div[8]/div[49]");
		WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
		WebElement element2 = wait2.until(ExpectedConditions.elementToBeClickable(xpath2));
		element2.click();
		
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div/div/div[1]/div[3]/div/button")).click();
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/meeting/6452ce047e5eecd4a8328e20/_cdbAGK_16");
		Thread.sleep(2000);
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/meeting/64530c8d1ecef2e2bc2edddf");
		
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[2]/div/input")).sendKeys("Arjun");
		Thread.sleep(3000);
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[2]/div/div/div/div[1]/div[2]/div/div/div/div/div[2]/button[6]")).click();
		Thread.sleep(3000);
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[2]/div/div/div/div[3]/div/div[2]/button")).click();
		Thread.sleep(3000);
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[3]/button")).click();
		
		
	}

}
