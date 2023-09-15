package tests;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestPM {

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
		
		//*[@id="__next"]/div/main/div/div/div[2]/div[1]/div[4]/div/div
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div[1]/div[4]/div/div")).click();

		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@id='timezone-select']")).click();
		WebElement ele = driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]/ul/li[2]"));
		JavascriptExecutor executor = (JavascriptExecutor)driver;
		executor.executeScript("arguments[0].click();", ele);
		
		//Recurrence
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div[2]/div[2]/div/div/div/div/div/button")).click();
		
		int i =0;
		
		while(i<3)
		{
			driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div[1]/div[1]/button[2]")).click();
			i++;
		}
		
		Thread.sleep(2000);
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div[2]/div/div[4]/div[2]/button")).click();
		
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[1]/div/div[3]/button[2]/span[1]/h6")).click(); //pm
		//driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div/div/span[10]")).click();
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[2]/button[3]")).click();
	
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[4]/div/div[1]/span[1]/button[3]")).click();
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[4]/div/div[2]/div[2]/div[7]/div[49]")).click();
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[4]/div/div/div[2]/div[5]/div[49]")).click();
		
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div[3]/div/button")).click();
		
		//to change
		//driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/meeting/646907875f2d92967e67531f/gQm732bZYF");
		Thread.sleep(5000);

		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/meeting/64691aeabfde9ba9d8a508f6");
		
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[2]/div/input")).sendKeys("Adam");
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[2]/div/div/div/div[1]/div[2]/div/div/div/div/div[2]/button[26]")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[2]/div/div/div/div[3]/div/div[2]/button")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[3]/button")).click();
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud");
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div/div/div[2]/a")).click();
		
		Thread.sleep(4000);
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/poll");
		driver.findElement(By.name("pollTitle")).sendKeys("Test Meet");
		driver.findElement(By.name("pollDescription")).sendKeys("Project Plan");
		driver.findElement(By.name("pollLocation")).sendKeys("Capen");
	
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[2]/div/div[4]/div/div/div/div/div/button")).click();
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div[2]/div/div[4]/div[1]/button")).click();
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[1]/div/div[3]/button[2]/span[1]/h6")).click(); //pm
		//driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[1]/div/div[2]/div/div/span[10]")).click();
		driver.findElement(By.xpath("/html/body/div[3]/div[3]/div/div[2]/button[3]")).click();
	
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[3]/div/div[1]/span[1]/button[3]")).click();
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[3]/div/div[2]/div[2]/div[5]/div[49]")).click();
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[3]/div/div[2]/div[2]/div[8]/div[49]")).click();
		
		//By xpath1 = By.xpath("//*[@id="__next"]/div/main/div/div/div[3]/div/div[2]/div[2]/div[5]/div[49]");
		//WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		//WebElement element1 = wait.until(ExpectedConditions.elementToBeClickable(xpath1));
		//element1.click();
		
		//By xpath2 = By.xpath("//*[@id=\"__next\"]/div/main/div/div/div[3]/div/div[2]/div[2]/div[5]/div[24]");
		//WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
		//WebElement element2 = wait2.until(ExpectedConditions.elementToBeClickable(xpath2));
		//element2.click();
		
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
		
		driver.navigate().to("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/participant/64690e4b63a011bb5f0b4a5d");
		Thread.sleep(2000);
		
		driver.findElement(By.xpath("//*[@id='timezone-select']")).click();
		WebElement ele1 = driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]/ul/li[284]/span"));
		JavascriptExecutor executor1 = (JavascriptExecutor)driver;
		executor1.executeScript("arguments[0].click();", ele1);
		//driver.findElement(By.xpath("div[@class='MuiPaper-root MuiMenu-paper MuiPaper-elevation8 MuiPopover-paper MuiPaper-rounded']")).click();
		//Select dropdown = new Select(staticDropdown);
		//dropdown.selectByVisibleText("Asia/Jakarta");
		//driver.findElement(By.xpath("//*[@id=\"menu-\"]/div[3]")).click();
		
		driver.findElement(By.id("{\"start\":1685166300000,\"end\":1685167200000,\"_id\":\"64690e4b63a011bb5f0b4a5e\"}")).click();
		int a =0;
		while(a<2)
		{
			driver.findElement(By.id("{\"start\":1684907100000,\"end\":1684908000000,\"_id\":\"64690e4b63a011bb5f0b4a5f\"}")).click();
			a++;
		}
		
		driver.findElement(By.xpath("//*[@id=\"__next\"]/div/main/div[3]/input")).sendKeys("poochi");
		driver.findElement(By.xpath("//*[@id='__next']/div/main/div[3]/button")).click();
		
	}

}
