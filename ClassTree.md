```tree.nathanfriend.io
Game
├── GameEngine (Facade)
├── GameObject
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
│   │   │   ├── Cow <- Mob
│   │   │   ├── Butterfly <- Mob
│   │   │   └── Chicken <- Mob
│   │   ├── NPC <- Character
│   │   ├── Player <- Character
│   │   └── CharacterArray
│   └── CollisionDetection
├── Resources
│   ├── ImageLoader
│   └── Map (Prototype) <- Level
│       ├── Layout (слой карты)
│       ├── LayoutArray <- Array (порядок рисования слоев карты)
│       └── CharacterArray <- Array
└── Storage (Singleton)
    ├── LocalStorage
    ├── SessionStorage
    └── ServerStorage (TODO)
            
```
Для генерации использовал [Tree Nathan Friend](https://tree.nathanfriend.io/).
URL сохрани сюда:
```url
https://tree.nathanfriend.io/?s=(%27optUs!(%27fancy!true~fullPathV~tzilingSlashV~rootDotV)~W!(%27W!%27Z5ZEngineHObject5AudioXQ5CamJaHLogic2Statq5InputX2ObsJvJxZPad6*Keyboard6*Mouse6*Touch65Level2Factory%20MethodxAnimatUX*32Stztegy%7D0MobmicroTask*.Enemy_Mob_%20CowY%20ButtJflyY%20ChickenYNPC_PlayJ_39*CollisUDetectU5ReWs*ImageLoadJ*Map2Prototypq0Level*.Layout28%D0%B94Layout9092%D0%BF%D0%BE%D1%80%D1%8F%D0%B4%D0%BE%D0%BA%20%D1%80%D0%B8%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%208%D0%B5%D0%B24390957Q*Local7*SessU7*SJvJ72TODO%7D%5Cn%27)~vJsU!%271%27)*5..%20%200%20%3C-%202%20%7B3ChazctJ4%20%D0%BA%D0%B0%D1%80%D1%82%D1%8Bx.5%5Cn.6ControllJ7Stozge8%D1%81%D0%BB%D0%BE9ArzyH2Facadq5ZJerQ2Singleton%7DUionV!falseWsourceXManagJY0Mob*.ZGame_03*.qe%7Dx%7D*zra%01zxq_ZYXWVUQJH987654320.*
```
