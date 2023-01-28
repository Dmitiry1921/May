import Map from "../classes/Map.js";
import Storage from "../classes/Storage.js";
import _Interface from "../classes/Interface.js";

import global from './global.js';
/**
 * Created by Dima101 on 24.04.2016.
 */
var doit = true; //Флаг доступности чего-либо..

export default {
  nps: {
    astof() {
      var $this = global._Mobs[global._Hero.nps], //Активный NPS
        hf = global._Hero.face, //Лицо героя..
        f = $this.options.face;//Лицо персонажа..
      _Interface.dialog.set([
        ["- Привет Салага, я слышал о тебе..", 'left', hf, 0, 0, 'right', f, 1, 0],
        // TODO РАСКОМЕНТИТЬ ПОСЛЕ РЕФАЧА
        // [" ..Ты тот кретин который отправился на майские праздники на острова..", 'left', hf, 3, 1],
        // [" ..В КРИЗИС !!!", 'left', hf, 1, 1, 'right', f, 3, 1],
        // ["Угу. Да эт. Я.."],
        // ["- Как мне известно валюты у тебя больше не осталось.."],
        // ["Да это точно, чертов рубль.."],
        // ["..когда он обвалился моих денег хватило только на рулон туалетной бумаги..", 'left', hf, 1, 1],
        // ["- И что же ты собираешься делать ?"],
        // ["Надо свалить с этих островов..", 'left', hf, 3, 1],
        // ["- А что это с тобой.. Где тебя так потаскало ?"],
        // ["Хотел есть, пришлось драться с котом за кусок тухлой рыбы.."],
        // ["- Ну в общем я всегда в твоем распоряжении..", 'right', f, 2, 1],
        // [" .. у меня есть лодка я могу отвезти тебе.."],
        // [" .. но только на соседние острова, горючего у меня не так много..."],
        // [" ..Не благодари, я тебя подлечил :)"],
        // ["Отлично, пойду осмотрюсь может какая работенка найдется.", 'left', hf, 3, 0],
        // ["- Кстати, меня зовут: " + $this.options.name, 'right', f, 2, 1]
      ],  () => {
        _Interface.quest.set("Найти уже девушку..^.^");
        $this.options.code = this.nps.busy; //Задаем НПС следующее действие.
        $this.movePath(5, 1, () => {
          $this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
        }); //Перемещаем НПС на координату
        global._Hero.options.health = 5; //Лечим игрока.
      });
    }, //НПС который встречает игрока..
    astifWait() {
      var $this =global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        [" - Я подожду тебя тут пока ты ищешь то что тебя интересует..", 'right', $this.options.face, 0, 0],
        ["Возвращайся сюда когда найдешь.."]
      ]);
    },
    astofComeBack(text, callback) {
      var $this =global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        ["Я смотрю ты нашел что искали, ну раз так, я отвезу тебя в Деревню..", 'right', $this.options.face, 0, 0]
      ], function () {
        $this.options.code = this.nps.busy
        Map.levelSet(0); //Возвращаем персонажа обратно.
        _Interface.quest.set(text);
        eval(callback);
        var Astof = Map.searchNPS('Астоф').options;
        Astof.code = this.nps.busy;
      });
    },
    busy() {
      const f = global._Mobs[global._Hero.nps].options.face;//Лицо персонажа..
      _Interface.dialog.set([
        ["Мне не когда, поговори с кем то другим..", 'right', f, 1, 0]
      ]);
    },
    vanessa() {
      var $this = global._Mobs[global._Hero.nps],
        astof = Map.searchNPS('Астоф').options;
      _Interface.dialog.set([
        [" - Здравствуй! Меня зовут: " + $this.options.name + ", это тебе нужны деньги что бы выбраться..", 'right', 11, 0, 0],
        // TODO РАСКОМЕНТИТЬ ПОСЛЕ РЕФАЧА
        // ["Да все верно.."],
        // ['- Я могу помочь тебе, отправляйся к причалу, и поговори с ' + astof.name + "ом он отвезет тебя на остров 'Труд'"],
        // ['..Добудь мне 9 морковок к праздничному столу, а я в замен пропущу тебя дальше и дам тебе не большой топорик что бы ты мог отбиваться от врагов..'],
        // ['Топорик, это интересно, отправлюсь сейчас же..'],
        // ['На острове найди Кирилла он фермер у него есть морковь, может он поможет тебе.. Но этот гад слишком жадный что бы делиться. Попробуй поговори  сним..'],
        // ['Хорошо, одна нога здесь другая там..'],
        // [' - Погоди ты, куда ты во что ты ее положишь то ?'],
        // ['... Не знаю.'],
        // ['Балда, вот тебе Рюкзак, теперь ступай к причалу..']
      ],  () => {
        global._Hero.setQuest({itm: 0, count: 9, callback: this.hero.carrot });
        _Interface.inventory.show(); //ООтображаем инвентарь игрока..
        _Interface.quest.set("Отправляйтесь к причалу");
        astof.code = this.nps.setLvl.bind(this, 'Поговори с Кириллом', 1);
      });
    }, //Даем игроку первое задание.
    vanessaComplete() {
      //Вернулись в деревню после мисси морковь
      var vanessa = Map.searchNPS('Ванесса').options;
      vanessa.code = this.nps.vanessaGetOut;
    },
    vanessaGetOut() {
      var $this = global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        ["Я вижу ты достал мне то что я просила, отлично вот тебе твой обещанный топорик, Проходи, Добро пожаловать в деревню..", "right", $this.options.face, 0, 0],
        ["..Даздраперма !!"],
        ["Вот тебе одежда, а то ходишь тут в одних трусах.. Она защитит тебя от врагов и даст тебе больший запас здоровья.."]
      ], function () {
        global._Hero.setTool(0); //Даем игроку топорик в руки..
        global._Hero.options.max.health = 10;
        global._Hero.options.health = 10;
        global._Hero.sprite.x = 0;
        global._Hero.sprite.y = 1;
        _Interface.inventory.delete(0, 9); //Удаляем морковь в кол-ве 9 шт из инвенторя.
        $this.options.code = this.nps.busy;
        $this.movePath(35, 15, function () {
          $this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
        });
        _Interface.quest.set('Найти работу..');
      });
    },
    setLvl(text, lvl) {
      var $this = global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        [" - И снова здравствуй, смотрю для тебя нашлась работенка..", 'right', $this.options.face, 0, 0],
        [" Ага.."],
        ['Ну что тогда отпровляемся..']
      ], function () {
        _Interface.quest.set(text);
        Map.levelSet(lvl);
        var Astof = Map.searchNPS('Астоф').options;
        Astof.code = this.nps.astifWait;
      });
    },
    IamBatman() {
      var $this = global._Mobs[global._Hero.nps], //Активный NPS
        f = $this.options.face;//Лицо персонажа..
      _Interface.dialog.set([
        [" - Я Бэтмен !", 'right', f, 0, 0]
      ]);
    },
    BatmenBoo() {
      var $this = global._Mobs[global._Hero.nps], //Активный NPS
        f = $this.options.face;//Лицо персонажа..
      //Отображаем бетмена..
      $this.options.visibility = true;

      _Interface.dialog.set(
        [
          [" - Я Бэтмен !", 'right', f, 0, 0],
          ["Чур меня чур. Изыди"],
          [" - Успокойся. ЯБэтмен"],
          ["Божечки-кошечки.."],
          ["..Бэтмен? Кто такой Бэтмен?"],
          [" - Чо? Ты серьезно?"],
          ['Ты из "The Prodigy" что-ли?'],
          [" - ЯБЭТМЕН. ЗАЩИТНИК ГОТЭМА. ГРОЗА ПРЕСТУПНОСТИ"],
          ["Знаешь, по моему гроза сейчас только в твоей голове. Буквально. Тебя молнией жахнуло?"],
          [" - Я побеждал Джокера, спасал мир, победил Супермена, занимался сексом с кошкой..."],
          ["..в смысле с Женщиной кошкой"],
          ["Огааа. А что ты умеешь?"],
          [" - ЯБэтмен"],
          ["И это должно меня удивить? Да ты просто мужик в обтягивающем трико под костюмом!"],
          [" - Я тебя ненавижу... Стоп. От куда ты знаешь, что под костюмом я в трико."],
          ["#ЯБэетмен"],
          ["Ты что тут делаешь?"],
          [" - В смысли?"],
          ["В смысле что ты делаешь в 2д игре? В игре про май. Тут солнышко и бабочки, а твой удел Ночь и дождь. Стой, не отвечай, я…я знаю, что ты скажешь"],
          [" - ....Разработчик упоролся, и решил что так будет забавнее.. и это.."],
          [" - ЯБэтмен!!!"],
          ["Ты фермера напугал ?"],
          [" - Пугал ? - Просто мимо проходил"],
          ["#Яснопонятноладнопойдупосру.."],
          ["- Стой, как добудешь какой не будь оружие вернить сюда и убей всех этих зомби."],
          ["Это все ?"],
          [" - НЕТ !"],
          [" - ЯБЭТМЕН !!"],
          [" - ЯБЭТМЕН !!"]
        ]
        , function () {
          var farmerBob = Map.searchNPS('Кирил').options;
          farmerBob.code = '_code.nps.famerBob1()';
          $this.options.code = '_code.nps.IamBatman()';
          $this.movePath(15, 4, function () {
            $this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
          });
          _Interface.quest.set('Расскажите Кирилу о Бэтмене');
        });
    },
    ask() {
      var $this = global._Mobs[global._Hero.nps].options;
      _Interface.dialog.set([
        ["Кирил ?", 'right', $this.face, 0, 0],
        [" - Похож но нет, " + $this.name]
      ]);
    },
    farmerBob() {
      var $this = global._Mobs[global._Hero.nps].options, //Активный NPS
        hf = global._Hero.face;
      _Interface.dialog.set([
        [" - Привет чудила, за чем пожаловал ?", 'right', $this.face, 3, 0],
        ["Дело к тебе есть, это ты " + $this.name + " ?"],
        [" - " + $this.name + ", с утра был, а за чем спрашиваешь ?", 'right', $this.face, 1, 0],
        ["Меня послала Ванесса что бы я принес ей морковь которую ты выращиваешь, для праздничного ужина. Ведь скоро 1 Мая - Праздник Труда ..", 'right', $this.face, 3, 1],
        [' - Я так понимаю ты очередной чувак в очередной игре в которой нужно ходить тудым сюдым что бы пройти ее ?', 'right', $this.face, 1, 0],
        ['Ага, разраб еще та ленивая жопа, ему просто не хватает кофе. По этому давай вернемся к делу..', 'left', hf, 3, 0],
        ['- В общем расклад таков мне кажеться что я схожу с ума, или же на до мной кто то зло шутит..', 'left', hf, 0, 0, 'right', $this.face, 2, 1],
        ['..Сижу я такой не давно на своем любимом пеньке, за который косарь отдал.. сижу как вдруг...'],
        ['...'],
        ['...Проноситься какой то темный силуэт и жутким голосом говорит...'],
        ["..Я Б * # ^ Н!!!!...", 'right', $this.face, 0, 1, 'left', hf, 0, 1],
        ['.. И молнееносно умчался в сторону храма..'],
        ['..так что я думаю либо я схожу с ума, либо кто то очень плохо шутит, разберись в чем дело тогда и поговорим..'],
        ['Хорошо но мне все же кажеться что ты просто бальной на голову который съел что то гнилое со своего огорода..', 'right', $this.face, 3, 1, 'left', hf, 3, 0],
        ['Но так уж и быть я поищю то что тебя так напугало..', 'right', $this.face, 1, 1, 'left', hf, 0, 0]
      ], () => {
        //Создаем на карте Бэтмена
        var batman = Map.searchNPS('Бэтмен').options;
        batman.life = true; //Включаем возможность контактировать с Бэтменом..
        batman.code = this.nps.BatmenBoo; //Устанавливаем функцию, которую будет выполнять Бэтмен.
        _Interface.quest.set('Найти подшутившего над Кирилом..');
      });
    },
    famerBob1() {
      var $this = global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        [" - Есть что рассказать мне ?", 'right', $this.options.face, 3, 0],
        ["Да, в общем это был Бэтмен."],
        [" - Бэтмен ? - из Продиджи что ли ?"],
        ["Ага, тот самый.."],
        ["Короче мне нужна морковка с твоей грядки, угостишь ?"],
        ["Угощю, но мне лень ее рвать, так что топай сам и возьми сколько нужно."],
        [" - Кстати будь аккуратнее тут по всюду зомби.."],
        ["Да ты че ? - А позже сказать не мог ?"],
        [" - Кстати будь аккуратнее тут по всюду зомби.."],
        ["Мля.."]
      ], () => {
        const boy = Map.searchNPS('Я похож на настоящего.. но Охраняю морковь');
        _Interface.quest.set('Выкопать морковку');
        $this.options.code = '_code.nps.busy()'; //Задаем НПС следующее действие.
        boy.movePath(33, 4, () => {
          boy.memory.pos = 'bottom';
        });
        $this.movePath(31, 15, () => {
          $this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
        });
      });
    },
    perma() {
      var $this = global._Mobs[global._Hero.nps],
        astof = Map.searchNPS('Астоф').options;
      _Interface.dialog.set([
        [" - Привет, меня зовут Даздраперма..", 'right', $this.options.face, 0, 0],
        ["Нихрена себе имечко.."],
        [" - Ну в общем не чего страшного всего лишь, Да здравствует первое мая!!"],
        ["Ага.. Слава сатане.."],
        [" - Слава.."],
        ["И так я понимаю у тебя есть для меня работенка ?"],
        [" - Да есть, в локации 'Труд' ты наверное видел, сколько там ходит нежити, перебей их всех, и возвращайся ко мне.."],
        ["Ага, я так понимаю что спрашивать почему именно Я, а не какой то спец отряд это должен сделать нет смысла просто потому что так задумано С Выше.. "],
        [" - Щито поделать.."],
        ["Ну тогда я пошел."],
        [" - Топорик свой не забудь, Раскольников хренов.."],
        ['Ага, спасиб.'],
        ["500 руб."],
        ["...Шутка минутка.."]
      ], () => {
        global._Hero.setQuest({callback: this.hero.killAll_lvl1, lvl: 1});
        _Interface.quest.set("Иди в порт..");
        astof.code = this.nps.setLvl.bind(this, 'Завалите гадов!',1);
        global._Hero.can.attack = true;
      });
    },
    permaComplete() {
      const perm = Map.searchNPS('Даздраперма').options;
      perm.code = this.nps.permaEnd;
    },
    permaEnd() {
      var $this = global._Mobs[global._Hero.nps],
        artaka = Map.searchNPS("Артака").options;
      _Interface.dialog.set([
        [" - Привет медвед!", 'right', $this.options.face, 0, 0],
        ["Привет как там тебя.."],
        [" - Даздраперма я вообще т0.."],
        ["Ага, слава сатане"],
        [" - Ага, ты еще скажи Замля моздайкер лук форевер."],
        ["Так значет ты мне там че то обещала дать ?"],
        [" - Не я просто проходной Этап.."],
        ["Аж да.. разраб же жадина.."],
        [" - Ну не знаю, ты о ком, я же просто код JS, не понимаю вообще о чем ты.."],
        ["А забей.."],
        [" - Короче видешь тип на горе стоит ?"],
        ["Вот тот рыжий что ли ?"],
        [" - Ага.. у него найдеться поручение для тебя.."],
        ["Отлично покончем же с этим.."],
        [" - Коммон.."]
      ], () => {
        _Interface.quest.set("Найти Артаку");
        $this.options.code = this.nps.busy;
        artaka.code = this.nps.artak;
      });
    },
    artak() {
      var $this = global._Mobs[global._Hero.nps],
        astof = Map.searchNPS('Астоф').options;
      _Interface.dialog.set([
        [" - Привет Я Артака", 'right', $this.options.face, 0, 0],
        ["А почему у тебя внешний вид один, а лицо у тебя вообще розовое, ну просто Разраб что нашел и инете то и всуну, рисовать этот тип видимо не умеет совсем.."],
        ["Ну давай сократим нашей действо, давай мне быстро задание и я пошел, кстати что ты мне дашь в замен ?"],
        [" - Я дам тебе в замен Меч которым ты сможешь убить Босса который находиться на локации о которой я расскажу Астофу когда ты .."],
        [' - Принесешь мне подсолнухи, так семок охота..'],
        ['Че реально ?'],
        ["А в магаз сгонять не вариат ?"],
        [" - Тут нет магазинов.."],
        ["А туалетную бумагу я где купил ?"],
        [" - Где ?"],
        ["Ясно, очередной глупый NPС, ладно что там тебе принести надо ?"],
        [" - Говорю же подсолнухи принеси мне но будь аккуратнее атаковать ты не можешь противников иначе было бы слишком легко игру пройти"],
        ['Окай постараюсь.']
      ], () => {
        astof.code = this.nps.setLvl.bind(this, 'Добудьте 8 подсолнухов', 2); //переносим игрока на уровень 2.
        global._Hero.setQuest({itm: 1, count: 8, callback: this.hero.sunflouwer}); //Добыть подсолнухи.
        _Interface.quest.set("Отправляйтесь на остров..");
      });
    },
    artakComplete() {
      var $this = Map.searchNPS('Артака').options;
      $this.code = this.nps.artakEnd;
    },
    artakEnd() {
      var $this = global._Mobs[global._Hero.nps].options,
        astof = Map.searchNPS('Астоф').options;
      _Interface.dialog.set([
        [" - Опа семки подъехали..", 'right', $this.face, 0, 0],
        ["Да на здоровье, давай качай мне статы гони мне меч. и еще Давай как мне какой то новый шмот, знаешь что там было.."],
        [' ...полнейший пипец.'],
        [' - Знаю, но семок то хотелось..'],
        [" - Все готово. не ругайся насяйника.."]
      ], () => {
        $this.code = this.nps.busy;
        astof.code = this.nps.setLvl.bind(this, 'Поговорите с Создателем',3);
        global._Hero.sprite.x = 1;
        global._Hero.sprite.y = 0;
        global._Hero.setTool(2); //Даем игроку меч
        _Interface.inventory.delete(1, 8);
        global._Hero.options.max.health = 20; //Увеличиваем кол-во жизней игрока.
        global._Hero.options.damage += 1; //увеличиваем его урон
        global._Hero.options.health = 15; //Лечим игрока на полную.
        _Interface.inventory.delete(0, 9); //Удаляем морковь в кол-ве 9 шт из инвенторя.
        _Interface.quest.set('Отправляйтесь с Автофу');
      });
    },
    starec() {
      var $this = global._Mobs[global._Hero.nps].options;
      _Interface.dialog.set([
        [" - Приветствую тебя юноша..", 'right', $this.face, 0, 0],
        ["Я так понимаю ты Создатель, это ты создал весь этот Трэш.."],
        [" - Да, это я, когда я разрабатывал эту игру времени у меня совсем не было.."],
        ["..Я очень хочу спать и у меня осталось не много сил.."],
        ["Постой, расскажи почему в игре так много косяков ?"],
        [" - Ну во первых мало времени, и не так много материалов в открыытом доступе.."],
        ["А создать текстуры полностью свои ?"],
        [" - Я не так силен в рисовании"],
        ["А почему имена персонажей такие дурацкие ?"],
        [" - Так как это моя первая игра я решил вложить в нее часть 'Людей' которые мне помогали.."],
        ["Ага, тоесть люди которые помогали тебе частично присудствуют в этом мире ?"],
        [" - Да именно так, сейчас я наконец то избавлюсь от наглеца который мучает вопросами.."],
        [" -  Сейчас у тебя стоит выбор.. либо пройти игру и и произойдет ... либо ты умрешь сдесь сражаясь с боссом игра начнеться сначала.."],
        ["Ну хотелось бы закончить и вернуться в реальный мир, выпить чашечку кофе.."],
        [" - Отдельное спасибо: Любе - За терпение и помощь с текстурами, Егору - За то что он Бэтмен, Skanerу - За Мотивацию :)"],
        [" - Прощай, и до скорой встречи.."]
      ], () => {
        //получаем последний квест убить всех монстров..
        global._Hero.sprite.x = 0;
        global._Hero.sprite.y = 0;

        global._Hero.setTool(1);

        global._Hero.options.max.health = 30; //Увеличиваем кол-во жизней игрока.
        global._Hero.options.health = global._Hero.options.max.health; //Лечим игрока на полную.

        global._Hero.can.attack = true;

        global._Hero.options.damage = 3;

        global._Hero.init(15, 8);
        global._Hero.setQuest({callback: this.hero.stage0, lvl: 3}); //Квест получен..

        _Interface.quest.set('Убей и Выживи');
      });
    },
    batmanEnd () {
      var $this = global._Mobs[global._Hero.nps];
      _Interface.dialog.set([
        [" - За чем ты убил всех этих Людей ?", 'right', $this.options.face, 0, 0],
        ["Их убил не Я, а Брюс Уэйн."],
        [" - Не может быть потому что Брюс Уэйн это.."],
        [" - Ага подловил меня.. Ты огребаешь.. Я и мои братки завалим тебя..", 'right', $this.options.face, 1, 0],
        ["Фак..", 'right', $this.face, 0, 0]
      ], () => {
        $this.type = 'animal';
        $this.options.visibility = false;
        $this.options.life = false;

        _code.hero.stage1();
        _Interface.quest.set('Надрать жопу Бэтмену');
        global._Hero.setQuest({callback: this.end, lvl: 3});
      });
    }
  },
  hero: {
    carrot: () => {
      var astof = Map.searchNPS('Астоф').options;
      //Задаем функцию, которая будет выполенна после того как мы выполнили квест.
      _Interface.quest.set("Вернитесь к причалу");
      astof.code = "_code.nps.astofComeBack('Поговорите с Ваннессой','_code.nps.vanessaComplete()')";
    },
    killAll_lvl1: () => {
      var astof = Map.searchNPS('Астоф').options;
      //Задаем функцию, которая будет выполенна после того как мы выполнили квест.
      _Interface.quest.set("Вернитесь в деревню");
      astof.code = "_code.nps.astofComeBack('Даздраперма ждем вас','_code.nps.permaComplete()')";
      global._Hero.can.attack = false;
    },
    sunflouwer: () => {
      var astof = Map.searchNPS('Астоф').options;
      _Interface.quest.set("Вернитесь к Астофу");
      astof.code = "_code.nps.astofComeBack('Вернитесь за наградой','_code.nps.artakComplete()')";
    },
    stage0: () => {
      var batmen = Map.searchNPS('Бэтмен').options;
      batmen.visibility = true;
      batmen.life = true;
      batmen.code = "_code.nps.batmanEnd()";
      _Interface.quest.set('Бэтмену что то Надо');
    },
    stage1: () => {
      global._Hero.options.damage = 15;
      //Все монстры убиты создаем бэтмена который будет Боссом.
      global._Mobs.push(new _Enemy("enemy", 2, 0, 0, 21, 7, {max: {health: 300}, health: 300, damage: 4}));
      global._Mobs.push(new _Enemy("enemy", 0, 2, 0, 21, 7, {max: {health: 100}, health: 100, damage: 1}));
      global._Mobs.push(new _Enemy("enemy", 0, 1, 0, 21, 7, {max: {health: 100}, health: 100, damage: 1}));
      global._Hero.setQuest({callback: "_code.end()", lvl: 3});
    }
  },
  enemy: {
    attack: () => {
      const $this = global._Mobs[global._Hero.nps]; //Активный NPS
      global._Hero.can.walk = true;
      if ($this !== undefined) {
        $this.actFlag = false;
        global._Hero.nps = null;
        if ($this.doit) {
          $this.doit = false;
          global._Hero.options.health = global._Hero.options.health - $this.options.damage >= 0 ? global._Hero.options.health - $this.options.damage : 0; //отнимаем одно очко жазней за сталкновение с Зомби.
          setTimeout(() => {
            $this.doit = true;
          }, 700);
        }
      } else {
        for (let i in global._Mobs) {
          var mob = global._Mobs[i];
          if (mob.type !== "enemy") continue;
          mob.actFlag = false;
        }
      }
    } //Работает !! НЕТРОЖЬ!!
  },
  end() {
    _Interface.dialog.set([
      ["...", 'right', 4, 3, 0],
      ["3.."],
      ["2.."],
      ["1.."],
      ["Что произходит ?"],
      ["Игра окончена Большое спасибо: Друзьям которые поддерживали и верили что у меня все получиться, Отдельные спасибо.."],
      ["Koshke_mr за помощь в рисовании текстур для редактора карт этой игры"],
      ["И Егору то что натолкнул на идею взять Бэтмена :) Панки Oi бро )"],
      ["Skanery, органезатору конкурса, если бы не он игра бы вышла только после написание диплома. А так же спасибо ему за его уроки. Продолжай в тоже духе."],
      ["И вам за то что не поленлись потратить час своей жизни на ее прохождение.. Всех Люблю ^.^"],
      ["Если хотите более серьезное продолжение этой версии игры пишите мне в ВК"],
      ["Ссылка на страницу в ВК будет в консоле что бы ее открыть нажмите F12->Console"],
      ["GG WP"],
      ["Через 30 сек. все начнеться по новой."]
    ], () => {
      console.log('https://vk.com/dmitriy1921');
      _Interface.quest.set('Игра пройдена. Спасибо.');
      setTimeout(() => {
        Storage.unset();
        location.reload()
      }, 30000);
    });
  }
};
