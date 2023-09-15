package tests;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;

public class OESSignup {

	public static void main(String[] args) {

		// TODO Auto-generated method stub

		System.setProperty("webdriver.chrome.driver", "C:\\Users\\bablo\\Downloads\\chromedriver_win32\\chromedriver.exe");
		WebDriver driver = new ChromeDriver();
		
		driver.get("https://application-oes.115t501qrjh8.us-east.codeengine.appdomain.cloud/Signup");
		driver.findElement(By.id("name")).sendKeys("hello@abc.com");
		driver.findElement(By.id("password")).sendKeys("Database@55");
		driver.findElement(By.id("confirmpassword")).sendKeys("Database@55");
		driver.findElement(By.cssSelector("button[class='mt-3 btn btn-primary btn-block']")).click();
		
		
	}

}
