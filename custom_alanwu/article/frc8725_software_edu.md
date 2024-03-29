<!-- title: FRC8725 軟體培訓教學 -->
<!-- description: 如何讓機器人動起來 -->
<!-- category: programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2022/09/08 -->
<!-- cover: <?=customDirPath?>/image/articleCover/frc8725_software_edu_cover.jpg -->

# 安裝環境
## WPILib 安裝
會附上 Vscode

搜尋 wpilib+年分 或是前往 [WPILib Installation Guide](https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-2/wpilib-setup.html) 下載符合自己作業系統的檔案

API Docs 
[Java](https://github.wpilib.org/allwpilib/docs/release/java/index.html) 
[C++](https://github.wpilib.org/allwpilib/docs/release/cpp/index.html)

## Frc game tools(NI) 安裝
包含 Roborio Imaging 以及 Driver Station

搜尋 FRC game tools 加年分或是前往 [FRC Game Tools Download](https://www.ni.com/zh-tw/support/downloads/drivers/download.frc-game-tools.html#479842) 選擇當年度的工具
(若原本已經有 FRC game tools 的只需要安裝新檔即可，更新時會自動覆蓋)

## 刷機用程式安裝
[CTRE phoenix](https://store.ctr-electronics.com/software/)

[REV Hardware Client](https://docs.revrobotics.com/rev-hardware-client/)


## 電腦本身的環境設定
在上傳程式碼或操控 Roborio 時才需要

1. 按下 windows建，尋找「具有進階安全性的 Windows 防火牆」
2. 點擊最下方的「Windows Defender 防火牆內容」
3. 接著會進入下圖介面，上方有三個設定檔
「網域設定檔、私人設定檔、公用設定檔」 將三個設定檔的「防火牆狀態」調整為關閉，三區皆調整完後按下「確定」

![](image/articleImage/frc8725_software_edu_image1.wm.png)

4. 當畫面顯示改變如下即設定成功

![](image/articleImage/frc8725_software_edu_image2.wm.png)


<span style="color: #e06c53">請注意!! 為了保護電腦的安全，務必在結束活動、使用完畢後，將防火牆設定用上述設定方式再度開啟。</span>

# 程式撰寫
## 建立新專案
1. 在安裝 WPILIB 的 Vscode 中，按下 F1 鍵，使指令區出現於上方
2. 在指令區中輸入 `` > WPILib: Create a new project ``
3. 填寫以下資訊
    1. 輸入 Example (範例程式) 或 Template (只提供模板)
    2. 選擇程式語言 (java或cpp)
    3. 選擇專案控制方式 (Time Robot、 Command Robot等)
    4. 選擇存檔位置
    5. 專案名稱
    6. 是否以資料夾方式儲存? (勾選)
    7. 輸入隊號
    8. 確認第三方軟件是否全部支援 WPILib 的相關物件(由於可能有部分軟件無法支援，會造成崩潰，因此此區<span style="color: #e06c53">請勿勾選</span>)
4. 確認資訊無誤後，點選 `Generate Project` 跳出的對話框選則 Yes

![](image/articleImage/frc8725_software_edu_image3.wm.png)

## 函式庫安裝
由於要撰寫來自不同經銷商(Vendor)控制器，因此需要下載其函示庫
1. 搜尋 WPILib vendor libraries 或是前往 [3rd Party Libraries](https://docs.wpilib.org/en/stable/docs/software/vscode-overview/3rd-party-libraries.html#libraries)
2. 複製該函式庫的網址
3. 至 Vscode 按下 `ctrl+shift+p` 進行指令搜尋 `Manage Vendor Libraries`
4. 選擇 `install new libraries(online)` 並貼上剛剛複製的網址，跳出 build 時請按確定
5. 函式庫安裝完成

## Command robot
### 檔案之間關係
![](image/articleImage/frc8725_software_edu_image4.wm.png)

## 常數設置
首先到 `src\main\java\frc\robot\` 底下

1.創建  `robotMap.java` 將馬達控制器接腳位置寫入其中 (以下是三種不同馬達控制器的接腳)
```java
package frc.robot;

public class robotMap {
    public class DriverPort {
        public class PWM_Port {
            public static final int kMotorPort = 9;
        }

        public class DIO_Port {
            public static final int kMotorPort = 0;
        }

        public class CAN_Port {
            public static final int kNEOMotorPort = 1;
            public static final int kFalconMotorPort = 2;
        }
    }
}
```
2. 創建 `GamepadJoystick.java`寫入搖桿編號

```java
package frc.robot;

public class GamepadJoystick {
    
    // 連接電腦的搖桿編號(可以同時使用多支搖桿)
    public static final int kDriverControllerPort = 0;
    
    // 類比搖桿(蘑菇頭)編號
    public static final int kDriverYAxis = 0;

}
```

3. 在 `Constants.java` 中寫入轉動速度最大值
```java
package frc.robot;

public final class Constants {

    public static final class DriveConstants {
        
        public static final double kSpeed = 0.3; // 0 < kSpeed <= 1
        
    }
}
```

## 馬達控制
### CIM 馬達
1. 在 `subsystems` 中創建 `DriveMotorModule.java`並且引入相關函式庫以及檔案，下方程式為會使用其中函式

```java
package frc.robot.subsystems;

import frc.robot.Constants;
import frc.robot.robotMap;
import edu.wpi.first.wpilibj.motorcontrol.PWMVictorSPX;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
```
2. 創建 `DriveMotorModule` 物件，以 PWMVictorSPX 宣告一顆 Spark ，此會用 PWM 接腳控制馬達

```java
public class DriveMotorModule {

    private PWMVictorSPX Motor;
    private double speed_input;

    public DriveMotorModule(int Motor_Port, boolean reverse) {
        
        Motor = new PWMVictorSPX(Motor_Port);
        Motor.setInverted(reverse);
        
    }
}
```

3. 在創建 Motor 物件之後，增加馬達程式前進的與停止程式: `.set(數值)` 進行速度控制(數值需介於 1.0 ~ -1.0 之間，負值為反轉)
```java
    public void setDesiredState(Double speed) {
        // 將 speed 乘以速度最大值
        this.speed_input = speed * Constants.DriveConstants.kSpeed 
        Motor.set(this.speed_input);

        // 在 SmartDashboard 顯示當前轉速
        SmartDashboard.putNumber("Speed: ", this.speed_input);
        
    }

    public void stop() {
        Motor.set(0);
    }
```

4. 創建 `DriveMotorSubststem.java` 引入 `SubsystemBase`、`robotMap` 與剛剛寫好的馬達模組檔
```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.subsystems.DriveMotorModule;
import frc.robot.robotMap;
```

5. 創建系統中的馬達模組、並撰寫系統控制 <span style="color: #e06c53">注意: 務必讓 class 以官方的 SubsystemBase 函式庫擴充</span>
```java
// 讓 class 以官方的 SubsystemBase 函式庫擴充
public class DriveMotorSubsystem extends SubsystemBase { 

    private static DriveMotorModule m_Motor;

    public DriveMotorSubsystem() {
        m_Motor = new DriveMotorModule( 
            robotMap.DriverPort.PWM_Port.kMotorPort,  
            false);
    }

    public void move(Double speed) {
        m_Motor.setDesiredState(speed);
    }

    public void stopModules() {
        m_Motor.stop();
    }
}
```

### NEO 馬達
1. 在 `subsystems` 中創建 `DriveMotorModule.java`並且引入相關函式庫以及檔案，下方程式為會使用其中函式

```java
package frc.robot.subsystems;

import frc.robot.Constants;
import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkMaxLowLevel.MotorType;
import com.revrobotics.CANSparkMax.IdleMode;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
```
2. 創建 `DriveMotorModule` 物件，以 PWMVictorSPX 宣告一顆 Spark ，此會用 PWM 接腳控制馬達

```java
public class DriveMotorModule {

    private CANSparkMax  Motor;
    private double speed_input;

    public DriveMotorModule(int Motor_Port, boolean reverse) {

        Motor = new CANSparkMax(Motor_Port, MotorType.kBrushless);

        Motor.setSmartCurrentLimit(30);

        // kBrake 會在馬達停止後鎖住馬達
        // kCoast 會在馬達停止後讓馬達保持慣性
        Motor.setIdleMode(IdleMode.kBrake); 
        Motor.setInverted(reverse);

    }
}
```

3. 在創建 Motor 物件之後，增加馬達程式前進的與停止程式: `.set(數值)` 進行速度控制(數值需介於 1.0 ~ -1.0 之間，負值為反轉)
```java
    public void setDesiredState(Double speed) {
        // 將 speed 乘以速度最大值
        this.speed_input = speed * Constants.DriveConstants.kSpeed 
        Motor.set(this.speed_input);

        // 在 SmartDashboard 顯示當前轉速
        SmartDashboard.putNumber("Speed: ", this.speed_input);
        
    }

    public void stop() {
        Motor.set(0);
    }
```

4. 創建 `DriveMotorSubststem.java` 引入 `SubsystemBase`、`robotMap` 與剛剛寫好的馬達模組檔
```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.subsystems.DriveMotorModule;
import frc.robot.robotMap;
```

5. 創建系統中的馬達模組、並撰寫系統控制 <span style="color: #e06c53">注意: 務必讓 class 以官方的 SubsystemBase 函式庫擴充</span>
```java
// 讓 class 以官方的 SubsystemBase 函式庫擴充
public class DriveMotorSubsystem extends SubsystemBase { 

    private static DriveMotorModule m_Motor;

    public DriveMotorSubsystem() {
        m_Motor = new DriveMotorModule( 
            robotMap.DriverPort.CAN_Port.kNEOMotorPort,  
            false);
    }

    public void move(Double speed) {
        m_Motor.setDesiredState(speed);
    }

    public void stopModules() {
        m_Motor.stop();
    }
}
```

## 搖桿控制
1. 在 `commands` 中創建 `DriveJoystickCmd.java`，引入 `CommandBase`、`Constants` 以及剛剛寫好的機構控制子程式

```java
package frc.robot.commands;

import java.util.function.Supplier;
import edu.wpi.first.wpilibj2.command.CommandBase;
import frc.robot.subsystems.DriveMotorSubsystem;
import frc.robot.Constants;
```

2. 建構一個 `MotorSubsystem` 與透過 Java 內建的 Supplier 創建一個 `SpeedFunction` 儲存搖桿所傳來的值, 最後加上`addRequirements(Subsystem物件名稱)` 增加指定要求  
<span style="color: #e06c53">注意: 務必讓 class 以官方的 CommandBase 函式庫擴充</span>

```java
// 讓 class 以官方的 CommandBase 函式庫擴充
public class DriveJoystickCmd extends CommandBase {

    private final DriveMotorSubsystem MotorSubsystem;
    private final Supplier<Double> SpeedFunction;


    public DriveJoystickCmd(DriveMotorSubsystem subsystem, Supplier<Double> SpeedFunction) {

        MotorSubsystem = subsystem;
        this.SpeedFunction = SpeedFunction;
        
        addRequirements(MotorSubsystem);
    }
}
```

3. 透過覆寫取搖桿值與呼叫 Command 的前進函式 
    1. `execute()` ，讓機器能重複執行；
    2. `end()` 使馬達最終能結束運作；
    3. `isFinished()` 寫入`false` 表示程式 Command 執行未結束 

```java
    @Override
    public void initialize() {}

    @Override
    public void execute() {
        // 1. Get real-time joystick inputs
        double Speed = SpeedFunction.get();
        MotorSubsystem.move(Speed);
    }

    @Override
    public void end(boolean interrupted) {
        MotorSubsystem.stopModules();
    }

    @Override
    public boolean isFinished() {
        return false;
    }
```

4. 找到 `RobotContainer.java` ，並且引入剛剛寫好的 `CommandSubsystem` 檔案，以及 `GamepadJoystick()`

```java
package frc.robot;

import edu.wpi.first.wpilibj.Joystick;
import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.commands.DriveJoystickCmd;
import frc.robot.subsystems.DirveMotorSubsystem;
```

5. 宣告一個機構模組(Subsystem)與搖桿，並在 Container 中進行搖　桿值的讀取傳入機構模組的函式中執行
```java
public class RobotContainer {

  private final DirveMotorSubsystem DriverSubsystem = new DirveMotorSubsystem();
  private final Joystick driverJoytick = new Joystick(GamepadJoystick.kControllerPort);

  public RobotContainer() {
    // Configure the trigger bindings
    DriverSubsystem.setDefaultCommand(new DriveJoystickCmd(DriverSubsystem, 
    () -> driverJoystick.getRawAxis(GamepadJoystick.kDriverYAxis))); 

    configureBindings();
  }

  private void configureBindings() {

  }

  public Command getAutonomousCommand() {
    // Autos.exampleAuto(m_exampleSubsystem);
    return null;
  }
}
```

5. 確認程式無報錯(紅字)之後，即可連接 Roborio，將程式碼上傳至Roborio 上測試(記得要先確定配線無誤、以及 Roborio 有正常連結式電腦上)在Vscode 上按下 Shift + F5 將程式碼上傳至 Roborio 上，底下會出現進度條，若最終出現 build Successful 即上傳完成，可以接上搖桿進行測試(連接 Roborio 的線不可拔開)

參考程式
https://github.com/FRC8725/FRC-8725-Software-Educational-Codes---y2023-/tree/main