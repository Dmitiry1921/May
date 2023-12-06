'use strict';

/**
 * Created by Dima101 on 24.04.2016.
 */
import {storage, MobMicroTask, Point, Face} from "../../GameEngine";
import {Dialog, dialog, quest, inventory, healthPower} from "../interfaces";
import {sprites} from "../assets";
import {Astof} from "../characters";

const {astofFace, heroFaceM, vanessaFace} = sprites;

// TODO удалить this и bind из кода
export const microtasksScope = {
	nps: {
		astof() {
			dialog.set([
				{
					text: "- Привет Салага, я слыхал о тебе..",
					faceLeft: Dialog.setFace(heroFaceM, heroFaceM.getTile(0, 0), Face.FLIP_NONE),
					faceRight: Dialog.setFace(astofFace, astofFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: '..ты тот кретин, который отправился на ЯМайские праздники на острова..',
					faceLeft: '',
					faceRight: '',
				},
				// {
				// 	text: '..В КРИЗИС !!!',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(3, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: 'Угу. Да эт. Я..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(0, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: "- Как мне известно денег у тебя больше не осталось..",
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(1, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: 'Да это точно, чертов рубль..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(0, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '..когда он обвалился моих денег хватило только на рулон туалетной бумаги..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(0, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '- И что же ты собираешься делать ?',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(2, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: 'Надо свалить с этих островов..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(2, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '- А что это с тобой. Где тебя так потаскало ?',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(0, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: 'Хотел есть, пришлось драться с крысой за остатки тухлой рыбы..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(1, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '- Ну в общем я всегда в твоем распоряжении..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(1, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: '.. у меня есть лодка я могу отвезти тебе но..',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(2, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '..только на соседние острова, горючего у меня не так много...',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(2, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: '..Не благодари, я тебя подлечил :)',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(2, 1), Face.FLIP_NONE),
				// },
				// {
				// 	text: 'Отлично, пойду осмотрюсь может какая работенка найдется.',
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(1, 0), Face.FLIP_NONE),
				// },
				// {
				// 	text: '- Кстати, меня зовут ' + this.currentNPC.name,
				// 	faceLeft: '',
				// 	faceRight: Dialog.setFace(astofFace, astofFace.getTile(3, 1), Face.FLIP_NONE),
				// },
			]);
			dialog.then(() => {
				// TODO
				quest.set("Найти уже девушку..^.^");
				healthPower.value = healthPower.max; // Лечим игрока.
				this.currentNPC.autoWalk.searchPathOnce(new Point(5 * 32, 32));
				this.currentNPC.autoWalk.then(() => {
					// Задаем микро задачу для НПС
					setTimeout(() => {
						this.currentNPC.setMicroTask(new MobMicroTask('code.nps.astofWait()'));
					}, 3000);
				});
			})

		}, // НПС который встречает игрока..
		astofWait() {
			dialog.set([
				{
					text: "- Я подожду тебя тут пока ты ищешь то что тебя интересует..",
					faceLeft: Dialog.setFace(heroFaceM, heroFaceM.getTile(0, 0), Face.FLIP_NONE),
					faceRight: '',
				},
				{
					text: "Возвращайся сюда когда найдешь..",
					faceLeft: Dialog.setFace(heroFaceM, heroFaceM.getTile(0, 0), Face.FLIP_NONE),
					faceRight: '',
				},
			]);
			dialog.then(() => {
				setTimeout(() => {
					this.currentNPC.setMicroTask(new MobMicroTask('code.nps.busy()'));
				}, 1000);
			});
		},
		astofComeBack(text, textCallback) {
			this.Interface.dialog.set([
				["Я смотрю ты нашли что искали, ну раз так я отвезу тебя в Деревню..", 'right', this.options.face, 0, 0]
			], () => {
				this.addHookAfterLoadMob(textCallback);
				this._Map.levelSet(0); //Возвращаем персонажа обратно.
				this.Interface.quest.set(text);
				this.options.code = "_code.nps.busy()";
			});
		},
		busy() {
			dialog.randomPhrase([
				{
					text: "Мне не когда, поговори с кем то другим..",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Прости, у меня сейчас нет времени. Попробуй обратиться к кому-то другому.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, я сейчас занят. Может быть, ты найдете кого-то другого для разговора?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "У меня сейчас очень много дел. Может быть, ты найдешь другого собеседника?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, я не могу сейчас поговорить. Попробуй обратиться к другому собеседнику.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Мне неудобно сейчас разговаривать. Можешь попробовать обратиться к кому-то другому?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Прости, я занят важными делами. Может быть, ты найдешь другого собеседника?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, у меня сейчас не хватает времени. Попробуй обратиться к кому-то другому.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Мне сейчас неудобно. Попробуй найти другого человека для разговора.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, я сейчас не доступен. Может быть, ты найдешь другого собеседника?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "У меня сейчас слишком много дел. Может быть, ты найдешь кого-то другого для беседы?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Прости, но я сейчас не могу поговорить. Может быть, найдешь другого собеседника?",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, у меня нет времени сейчас. Попробуй найти кого-то другого для разговора.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Мне неудобно разговаривать сейчас. Попробуй обратиться к другому собеседнику.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Прости, я сейчас занят. Попробуй найти другого человека для разговора.",
					faceLeft: '',
					faceRight: '',
				},
				{
					text: "Извини, у меня сейчас нет возможности разговаривать. Можете обратиться к кому-то другому.",
					faceLeft: '',
					faceRight: '',
				}
			]);
			dialog.then(() => {
				setTimeout(() => {
					this.currentNPC.setMicroTask(new MobMicroTask('code.nps.busy()'));
				}, 3000);
			});
		},
		vanessa() {
			// const astof = this._Map.searchNPS('Астоф').options;
			dialog.set([
				{
					text: " - Здравствуй! Меня зовут: " + this.currentNPC.name + ", это тебе нужны деньги что бы выбраться..",
					faceLeft: Dialog.setFace(heroFaceM, heroFaceM.getTile(0, 0), Face.FLIP_NONE),
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: 'Да все верно..',
					faceLeft: '',
					faceRight: '',
				},
				{
					text: '- Я могу помочь тебе, отправляйся к причалу, и поговори с ' + Astof.name + "ом он отвезет тебя на остров 'Труд'",
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: '..Добудь мне 9 морковок к праздничному столу, а я в замен пропущу тебя дальше и дам тебе не большой топорик что бы ты мог отбиваться от врагов..',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: 'Топорик, это интересно, отправлюсь сейчас же..',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: 'На острове найди Кирилла он фермер у него есть морковь, может он поможет тебе.. Но этот гад слишком жадный чтобы делиться. Попробуй поговори с ним..',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: 'Хорошо, одна нога здесь другая там..',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: ' - Погоди ты, куда ты ? Во что ты ее положишь ?',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				},
				{
					text: '... Не знаю.',
					faceLeft: '',
					faceRight: '',
				},
				{
					text: 'Балда, вот тебе Рюкзак, теперь ступай к причалу..',
					faceLeft: '',
					faceRight: Dialog.setFace(vanessaFace, vanessaFace.getTile(0, 0), Face.FLIP_NONE),
				}
			]);
			dialog.then(() => {
				this.currentNPC.setMicroTask(new MobMicroTask('code.nps.busy()'));
				Astof.setMicroTask(new MobMicroTask('_code.nps.setLvl(\'Поговори с Кирилом\',1)'));
				inventory.show(); //Отображаем инвентарь игрока..
				quest.set("Отправляйся к причалу");
				quest.moveTo(new Point(inventory.point.x, inventory.point.y + inventory.height));
			});
		// 				this._Hero.setQuest({itm: 0, count: 9, callback: "_code.hero.carrot()"});

		}, //Даем игроку первое задание.
		vanessaComplete() {
			//Вернулись в деревню после мисси морковь
			var vanessa = this._Map.searchNPS('Ванесса').options;
			vanessa.code = "_code.nps.vanessaGetOut()";
		},
		vanessaGetOut() {
			this.Interface.dialog.set([
				["Я вижу ты достал мне то что я просила, отлично вот тебе твой обещанный топорик, Проходи, Добро пожаловать в деревню..", "right", this.options.face, 0, 0],
				["..Даздраперма !!"],
				["Вот тебе одежда, а то ходишь тут в одних трусах.. Она защитит тебя от врагов и даст тебе больший запас здоровья.."]
			], () => {
				this._Hero.setTool(0); //Даем игроку топорик в руки.
				this._Hero.options.max.health = 10;
				this._Hero.options.health = 10;
				this._Hero.sprite.x = 0;
				this._Hero.sprite.y = 1;
				this.Interface.inventory.delete(0, 9); //Удаляем морковь в кол-ве 9 шт из инвентаря.
				this.options.code = "_code.nps.busy()";
				this.movePath(35, 15, () => {
					this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
				});
				this.Interface.quest.set('Найти работу..');
			});
		},
		setLvl(text, lvl) {
			this.Interface.dialog.set([
				[" - И снова здравствуй, смотрю для тебя нашлась работенка..", 'right', this.options.face, 0, 0],
				[" Ага.."],
				['Ну что тогда отправляемся..']
			], () => {
				this.Interface.quest.set(text);
				this._Map.levelSet(lvl);
				this.addHookAfterLoadMob('_code.nps.setLvlHook()');
			});
		},
		setLvlHook(text, lvl) {
			var Astof = this._Map.searchNPS('Астоф').options;
			Astof.code = "_code.nps.astofWait()";
		},
		IamBatman() {
			const f = this.options.face;//Лицо персонажа..
			this.Interface.dialog.set([
				[" - Я Бэтмен !", 'right', f, 0, 0]
			]);
		},
		BatmenBoo() {
			const f = this.options.face;//Лицо персонажа..
			//Отображаем бэтмена..
			this.options.visibility = true;

			this.Interface.dialog.set(
				[
					[" - Я Бэтмен !", 'right', f, 0, 0],
					["Чур меня чур. Изыди"],
					[" - Успокойся. ЯБэтмен"],
					["Божечки-кошечки.."],
					["..Бэтмен? Кто такой Бэтмен?"],
					[" - Чо? Ты серьезно?"],
					["Ты из The Prodigy что-ли?"],
					[" - ЯБЭТМЕН. ЗАЩИТНИК ГОТЭМА. ГРОЗА ПРЕСТУПНОСТИ"],
					["Знаешь, по моему гроза сейчас только в твоей голове. Буквально. Тебя молнией жахнуло?"],
					[" - Я побеждал Джокера, спасал мир, победил Супермена, занимался сексом с кошкой..."],
					["..в смысле с Женщиной кошкой"],
					["Огааа. А что ты умеешь?"],
					[" - ЯБэтмен"],
					["И это должно меня удивить? Да ты просто мужик в обтягивающем трико под костюмом!"],
					[" - Я тебя ненавижу...Стоп. От куда ты знаешь, что под костюмом я в трико."],
					["#ЯБэтмен"],
					["Ты что тут делаешь?"],
					[" - В смысли?"],
					["В смысле что ты делаешь в 2д игре? В игре про май. Тут солнышко и бабочки, а твой удел Ночь и дождь. Стой, не отвечай, я…я знаю, что ты скажешь"],
					[" - ....Разработчик упоролся, и решил что так будет забавнее.. и это.."],
					[" - ЯБэтмен!!!"],
					["Ты фермера напугал ?"],
					[" - Пугал ? - Просто мимо проходил"],
					["#Яснопонятноладнопойдупосру.."],
					["- Стой, как добудешь какой не будь оружие вернись сюда и убей всех этих зомби."],
					["Это все ?"],
					[" - НЕТ !"],
					[" - ЯБЭТМЕН !!"],
					[" - ЯБЭТМЕН !!"]
				]
				, () => {
					var farmerBob = this._Map.searchNPS('Кирил').options;
					farmerBob.code = '_code.nps.farmerBob1()';
					this.options.code = '_code.nps.IamBatman()';
					this.movePath(15, 4, () => {
						this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
					});
					this.Interface.quest.set('Расскажите Кириллу о Бэтмане');
				});
		},
		ask() {
			this.Interface.dialog.set([
				["Кирил ?", 'right', this.options.face, 0, 0],
				[" - Похож но нет, " + this.options.name]
			]);
		},
		farmerBob() {
			const hf = this._Hero.face;
			this.Interface.dialog.set([
				[" - Привет, чудила, зачем пожаловал?", 'right', this.options.face, 3, 0],
				["Дело к тебе есть, это ты, " + this.options.name + "?"],
				[" - " + this.options.name + ", с утра был, а зачем спрашиваешь?", 'right', this.options.face, 1, 0],
				["Меня послала Ванесса, чтобы я принес ей морковь, которую ты выращиваешь, для праздничного ужина. Ведь скоро 1 мая - Праздник Труда...", 'right', this.options.face, 3, 1],
				[' - Я так понимаю, ты очередной чувак в очередной игре, в которой нужно ходить туда-сюда, чтобы пройти её?', 'right', this.options.face, 1, 0],
				['Ага, разработчик ещё та ленивая жопа, ему просто не хватает кофе. Поэтому давай вернёмся к делу...', 'left', hf, 3, 0],
				['- В общем, расклад таков: мне кажется, что я схожу с ума, или же надо мной кто-то зло шутит...', 'left', hf, 0, 0, 'right', this.options.face, 2, 1],
				['...Сижу я такой, не давно на своём любимом пеньке, за который косарь отдал... сижу, как вдруг...'],
				['...'],
				['...Проносится какой-то тёмный силуэт и жутким голосом говорит...'],
				["..ЯБ*#^Н!!!!...", 'right', this.options.face, 0, 1, 'left', hf, 0, 1],
				['.. И молниеносно умчался в сторону храма...'],
				['..Так что я думаю, либо я схожу с ума, либо кто-то очень плохо шутит, разберись в чем дело, тогда и поговорим...'],
				['Хорошо, но мне все же кажется, что ты просто балбес, который съел что-то гнилое со своего огорода...', 'right', this.options.face, 3, 1, 'left', hf, 3, 0],
				['Но так уж и быть, я поищу то, что тебя так напугало...', 'right', this.options.face, 1, 1, 'left', hf, 0, 0]
			], () => {
				this.options.code = "_code.nps.busy()";
				//Создаем на карте Бэтмена..
				var batman = this._Map.searchNPS('Бэтмен').options;
				batman.life = true; //Включаем возможность контактировать с Бэтменом..
				batman.code = "_code.nps.BatmenBoo()"; //Устанавливаем функцию которую будет выполнять Бэтмен.
				this.Interface.quest.set('Найти подшутившего над Кирилом..');
			});
		},
		farmerBob1() {
			this.Interface.dialog.set([
				[" - Есть что рассказать мне?", 'right', this.options.face, 3, 0],
				["Да, в общем, это был Бэтмен."],
				[" - Бэтмен? - из The Prodigy, что ли?"],
				["Ага, тот самый..."],
				["Короче, мне нужна морковка с твоей грядки, угостишь?"],
				["Угощу, но мне лень её рвать, так что топай сам и возьми сколько нужно."],
				[" - Кстати, будь аккуратнее, тут по всюду зомби..."],
				["Да ты че? - А позже сказать не мог?"],
				[" - Кстати, будь аккуратнее, тут по всюду зомби..."],
				["Мля..."]
			], () => {
				var boy = this._Map.searchNPS('Я похож на настоящего.. но Охраняю морковь');
				this.Interface.quest.set('Выкопать морковку');
				this.options.code = '_code.nps.busy()'; //Задаем НПС следующее действие.
				boy.movePath(33, 4, () => {
					boy.memory.pos = 'bottom';
				});
				this.movePath(31, 15, () => {
					this.memory.pos = 'bottom'; //Поворачиваем НПС лицом к игроку.
				});
			});
		},
		perma() {
			const astof = this._Map.searchNPS('Астоф').options;
			this.Interface.dialog.set([
				[" - Привет, меня зовут Даздраперма..", 'right', this.options.face, 0, 0],
				["Нихрена себе имечко.."],
				[" - Ну в общем не чего страшного всего лишь, Да здравствует первое мая!!"],
				["Ага.. Слава сатане.."],
				[" - Слава.."],
				["И так я понимаю у тебя есть для меня работенка ?"],
				[" - Да есть, в локации 'Труд' ты наверное видел, сколько там ходит нежити, перебей их всех, и возвращайся ко мне.."],
				["Ага, я так понимаю что спрашивать почему именно Я, а не какой-то спец отряд это должен сделать нет смысла просто потому что так задумано С Выше.. "],
				[" - Щито поделать.."],
				["Ну тогда я пошел."],
				[" - Топорик свой не забудь, Раскольников хренов.."],
				['Ага, спасиб.'],
				["500 руб."],
				["...Шутка минутка.."]
			], () => {
				this._Hero.setQuest({callback: "_code.hero.killAll_lvl1()", lvl: 1});
				this.Interface.quest.set("Иди в порт..");
				astof.code = "_code.nps.setLvl('Завалите гадов!',1)";
				this._Hero.can.attack = true;
			});
		},
		permaComplete() {
			var perm = this._Map.searchNPS('Даздраперма').options;
			perm.code = "_code.nps.permaEnd()";
		},
		permaEnd() {
			const artaka = this._Map.searchNPS("Артака").options;
			this.Interface.dialog.set([
				[" - Привет медвед!", 'right', this.options.face, 0, 0],
				["Привет как там тебя.."],
				[" - Даздраперма я вообще т0.."],
				["Ага, слава сатане"],
				[" - Ага, ты еще скажи Земля моздайкер лук форевер."],
				["Так значит ты мне там чё то обещала дать ?"],
				[" - Не я просто проходной Этап.."],
				["Аж да.. разраб жадина же.."],
				[" - Ну не знаю, ты о ком, я же просто код JS, не понимаю вообще о чем ты.."],
				["А забей.."],
				[" - Короче видишь тип на горе стоит ?"],
				["Вот тот рыжий что ли ?"],
				[" - Ага.. у него найдется поручение для тебя.."],
				["Отлично покончим же с этим.."],
				[" - Коммон.."]
			], () => {
				this.Interface.quest.set("Найти Артаку");
				this.options.code = "_code.nps.busy()";
				artaka.code = "_code.nps.artak()";
			});
		},
		artak() {
			const astof = this._Map.searchNPS('Астоф').options;
			this.Interface.dialog.set([
				[" - Привет Я Артака", 'right', this.options.face, 0, 0],
				["А почему у тебя внешний вид один, а лицо у тебя вообще розовое, ну просто Разраб что нашел и инете то и всуну, рисовать этот тип видимо не умеет совсем.."],
				["Ну давай сократим нашей действо, давай мне быстро задание и я пошел, кстати что ты мне дашь взамен ?"],
				[" - Я дам тебе взамен Меч которым ты сможешь убить Босса, который находиться на локации о которой я расскажу Астофу когда ты .."],
				[' - Принесешь мне подсолнухи, так семак охота..'],
				['Че реально ?'],
				["А в магаз сгонять не вариант ?"],
				[" - Тут нет магазинов.."],
				["А туалетную бумагу я где купил ?"],
				[" - Где ?"],
				["Ясно, очередной глупый NPС, ладно что там тебе принести надо ?"],
				[" - Говорю же подсолнухи принеси мне, но будь аккуратнее атаковать ты не можешь противников иначе было бы слишком легко игру пройти"],
				['Окай постараюсь.']
			], () => {
				astof.code = "_code.nps.setLvl('Добудьте 8 подсолнухов',2);"; //переносим игрока на уровень 2.
				this._Hero.setQuest({itm: 1, count: 8, callback: "_code.hero.sunflouwer()"}); //Добыть подсолнухи.
				this.Interface.quest.set("Отправляйтесь на остров..");
			});
		},
		artakComplete() {
			const artaka = this._Map.searchNPS('Артака').options;
			artaka.code = "_code.nps.artakEnd()";
		},
		artakEnd() {
			const astof = this._Map.searchNPS('Астоф').options;
			this.Interface.dialog.set([
				[" - Опа семки подъехали..", 'right', this.options.face, 0, 0],
				["Да на здоровье, качай мне статы, гони мне меч. И еще давай как мне какой-то новый шмот, знаешь что там было.."],
				[' ...полнейший пипец.'],
				[' - Знаю, но семок то хотелось..'],
				[" - Все готово. не ругайся насяйника.."]
			], () => {
				this.code = "_code.nps.busy()";
				astof.code = "_code.nps.setLvl('Поговорите с Создателем',3)";
				this._Hero.sprite.x = 1;
				this._Hero.sprite.y = 0;
				this._Hero.setTool(2); //Даем игроку меч
				this.Interface.inventory.delete(1, 8);
				this._Hero.options.max.health = 20; //Увеличиваем кол-во жизней игрока.
				this._Hero.options.damage += 1; //увеличиваем его урон
				this._Hero.options.health = 15; //Лечим игрока на полную.
				this.Interface.inventory.delete(0, 9); //Удаляем морковь в кол-ве 9 шт из инвенторя.
				this.Interface.quest.set('Отправляйтесь с Астовом');
			});
		},
		starec() {
			this.Interface.dialog.set([
				[" - Приветствую тебя юноша..", 'right', this.options.face, 0, 0],
				["Я так понимаю ты Создатель, это ты создал весь этот треш.."],
				[" - Да, это я, когда я разрабатывал эту игру времени у меня совсем не было.."],
				["..Я очень хочу спать и у меня осталось не много сил.."],
				["Постой, расскажи почему в игре так много косяков ?"],
				[" - Ну во первых мало времени, и не так много материалов в открытом доступе.."],
				["А создать текстуры полностью свои ?"],
				[" - Я не так силен в рисовании"],
				["А почему имена персонажей такие дурацкие ?"],
				[" - Так как это моя первая игра я решил вложить в нее часть 'Людей' которые мне помогали.."],
				["Ага, то есть люди которые помогали тебе частично присутствуют в этом мире ?"],
				[" - Да именно так, сейчас я наконец то избавлюсь от наглеца который мучает вопросами.."],
				[" -  Сейчас у тебя стоит выбор либо пройти игру и произойдет ... либо ты умрешь здесь сражаясь с боссом игра начнется сначала.."],
				["Ну хотелось бы закончить и вернуться в реальный мир, выпить чашечку кофе.."],
				[" - Отдельное спасибо: Любе - За терпение и помощь с текстурами, Егору - За то что он Бэтмен, Skanerу - За Мотивацию :)"],
				[" - Прощай, и до скорой встречи.."]
			], () => {
				//получаем последний квест убить всех монстров..
				this._Hero.sprite.x = 0;
				this._Hero.sprite.y = 0;

				this._Hero.setTool(1);

				this._Hero.options.max.health = 30; //Увеличиваем кол-во жизней игрока.
				this._Hero.options.health = this._Hero.options.max.health; //Лечим игрока на полную.

				this._Hero.can.attack = true;

				this._Hero.options.damage = 3;

				this._Hero.init(15, 8);
				this._Hero.setQuest({callback: "_code.hero.stage0()", lvl: 3}); //Квест получен..

				this.Interface.quest.set('Убей и Выживи');
			});
		},
		batmanEnd() {
			this.Interface.dialog.set([
				[" - За чем ты убил всех этих Людей ?", 'right', this.options.face, 0, 0],
				["Их убил не Я, а Брюс Уэйн."],
				[" - Не может быть потому что Брюс Уэйн это.."],
				[" - Ага подловил меня.. Ты огребаешь.. Я и мои братки завалим тебя..", 'right', this.options.face, 1, 0],
				["Фак..", 'right', this.options.face, 0, 0]
			], () => {
				this.type = 'animal';
				this.options.visibility = false;
				this.options.life = false;

				this._Hero.options.damage = 15;
				//Все монстры убиты создаем бэтмена который будет Боссом.
				this._Mobs.push(new this.Enemy("enemy", 2, 0, 0, 21, 7, {max: {health: 300}, health: 300, damage: 4}));
				this._Mobs.push(new this.Enemy("enemy", 0, 2, 0, 21, 7, {max: {health: 100}, health: 100, damage: 1}));
				this._Mobs.push(new this.Enemy("enemy", 0, 1, 0, 21, 7, {max: {health: 100}, health: 100, damage: 1}));


				this.Interface.quest.set('Надрать жопу Бэтмену');
				this._Hero.setQuest({callback: "_code.end()", lvl: 3});
			});
		}
	},
	hero: {
		carrot() {
			var astof = this._Map.searchNPS('Астоф').options;
			//Задаем функцию, которая будет выполнена после того как мы выполнили квест.
			this.Interface.quest.set("Вернитесь к причалу");
			astof.code = "_code.nps.astofComeBack('Поговорите с Ваннессой', '_code.nps.vanessaComplete()')";
		},
		killAll_lvl1() {
			var astof = this._Map.searchNPS('Астоф').options;
			//Задаем функцию, которая будет выполнена после того как мы выполнили квест.
			this.Interface.quest.set("Вернитесь в деревню");
			astof.code = "_code.nps.astofComeBack('Даздраперма ждем вас', '_code.nps.permaComplete()')";
			this._Hero.can.attack = false;
		},
		sunflouwer() {
			var astof = this._Map.searchNPS('Астоф').options;
			this.Interface.quest.set("Вернитесь к Астофу");
			astof.code = "_code.nps.astofComeBack('Вернитесь за наградой', '_code.nps.artakComplete()')";
		},
		stage0() {
			var batmen = this._Map.searchNPS('Бэтмен').options;
			batmen.visibility = true;
			batmen.life = true;
			batmen.code = "_code.nps.batmanEnd()";
			this.Interface.quest.set('Бэтмену что то Надо');
		}
	},
	enemy: {
		attack() {
			var $this = this._Mobs[this._Hero.nps]; //Активный NPS
			this._Hero.can.walk = true;
			if ($this != undefined) {
				$this.actFlag = false;
				this._Hero.nps = null;
				if ($this.doit) {
					$this.doit = false;
					this._Hero.options.health = this._Hero.options.health - $this.options.damage >= 0 ? this._Hero.options.health - $this.options.damage : 0; //отнимаем одно очко жизней за столкновение с Зомби.
					setTimeout(function () {
						$this.doit = true;
					}, 700);
				}
			} else {
				for (var i in this._Mobs) {
					var mob = this._Mobs[i];
					if (mob.type != "enemy") continue;
					mob.actFlag = false;
				}
			}
		} //Работает !! НЕ ТРОЖ!!
	},
	end() {
		this.Interface.dialog.set([
			["...", 'right', 4, 3, 0],
			["3.."],
			["2.."],
			["1.."],
			["Что происходит ?"],
			["Игра окончена Большое спасибо: Друзьям которые поддерживали и верили что у меня все получиться, Отдельные спасибо.."],
			["Koshke_mr за помощь в рисовании текстур для редактора карт этой игры"],
			["И Егору то что натолкнул на идею взять Бэтмена :) Панки Oi бро )"],
			["Skanery, организатору конкурса, если бы не он игра бы вышла только после написание диплома. А так же спасибо ему за его уроки. Продолжай в тоже духе."],
			["И вам за то что не поленились потратить час своей жизни на ее прохождение.. Всех Люблю ^.^"],
			["Если хотите более серьезное продолжение этой версии игры пишите мне в ВК"],
			["Ссылка на страницу в ВК будет в консоли, что бы ее открыть нажмите F12->Console"],
			["GG WP"],
			["Через 30 сек. все начнется по новой."]
		], () => {
			console.log('https://vk.com/dmitriy1921');
			this.Interface.quest.set('Игра пройдена. Спасибо.');
			setTimeout(() => {
				this._gameSet(() => {
				});
				storage.clearAll();
				location.reload()
			}, 30000);
		});
	}
};
