```tree.nathanfriend.io
GameEngine (Facade)
├── AudioManager (Singleton)
├── Camera (Facade)
├── GameLogic (State)
├── InputManager (Observer)
│   ├── GamePadController
│   ├── KeyboardController
│   ├── MouseController
│   └── TouchController
├── Level (Factory Method)
│   ├── AnimationManager
│   ├── Character (Strategy) <- MobmicroTask
│   │   ├── Enemy <- Character
│   │   ├── Mob <- Character
│   │   ├── NPC <- Character
│   │   ├── Player <- Character
│   │   └── CollisionDetection
│   ├── Resources
│   │   ├── AudioLoader
│   │   └── ImageLoader
│   └── Map (Prototype) <- Level
│       └── Layout <- Array (к примеру overlay, walls и т.д.)
└── Storage (Singleton)
    ├── LocalStorage
    └── SessionStorage
            
```
Для генерации использовал [Tree Nathan Friend](https://tree.nathanfriend.io/).
URL сохрани сюда:
```url
https://tree.nathanfriend.io/?s=(%27optBs!(%27fancy!true~fuZPathH~tYilingSlashH~_otDotH)~W(%27W%27VEngineUAudioJQ8Cam7aUVLogic3State8InputJ3Obs7v7XVPad5*Keyboard5*Mouse5*Touch52Levelqjry%20MethodXAnimatBJ*R3StYtegyxMobmic_Task*6Enemy0Mob0NPC0Play70CoZisBDetectB*ImageLoad7*Map3P_jtypexLevel*6Layout4ArYy3%D0%BA%20%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%83%20ov7lay%2C%20waZs%20%D0%B8%20%D1%82.%D0%B4.89QXLocal9*SessB9%27)~v7sB!%271%27)*2604R*62%5Cn63%20%7B4%20%3C-%205Cont_Z76%20%207er8%7D29SjYgeBionH!falseJManag7Q3SinglejnRChaYct7Uqade8VGameWsource!X%7D*YraZll_rojtoq3Facx%7D4%01xqj_ZYXWVURQJHB987654320*
```
