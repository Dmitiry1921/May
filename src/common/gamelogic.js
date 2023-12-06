'use strict';

// В случае если персонаж приближается к NPC тот смотрит в сторону персонажа
import {ImageLoader, SpriteAnimation, Vector2, AnimationState, COLLIDER_TYPE} from "../../GameEngine";
import {STATE, ANIMATION_FRAMES} from "../common";

export class GameLogic {
	/**
	 * Поворачивает NPC в сторону персонажа
	 * @param npc
	 */
	static npcLookAtPlayer(npc) {
		// Добавляем обработчик столкновения с персонажем
		npc.vision.handelType(COLLIDER_TYPE.PLAYER);
		// Если персонаж столкнулся с NPC
		if (npc.vision.hasIntersectedInCurrentFrameWithType(COLLIDER_TYPE.PLAYER)) {
			const [PlayerCollider] = npc.vision.getCollidedWithType(COLLIDER_TYPE.PLAYER).values();
			const playerCenter = new Vector2(PlayerCollider.x + PlayerCollider.width / 2, PlayerCollider.y + PlayerCollider.height / 2);
			const astofCenter = new Vector2(npc.vision.x, npc.vision.y);
			const distance = Vector2.diff(astofCenter, playerCenter).normalize();
			if (distance.x > .5) {
				npc.handleEvent(STATE.IDLE_LEFT);
			}
			if (distance.x < -.5) {
				npc.handleEvent(STATE.IDLE_RIGHT);
			}
			if (distance.y > .5) {
				npc.handleEvent(STATE.IDLE_TOP);
			}
			if (distance.y < -.5) {
				npc.handleEvent(STATE.IDLE_BOTTOM);
			}
			return;
		}
		npc.stateAnimation.setState(npc.stateAnimation.defaultState.name);
	}

	/**
	 * Возвращает набор анимаций для персонажа
	 * @param resource {ImageLoader} - Sprite Sheet
	 * @param start {Vector2} - Начальная точка на spritesheet'е
	 * @param speed {Number} - Скорость переключения кадров
	 */
	static getAnimations(resource, start, speed = undefined) {
		if (!(resource instanceof ImageLoader)) throw new TypeError('resource must be ImageLoader');
		if (!(start instanceof Vector2)) throw new TypeError('start must be Vector2');
		return Object.keys(STATE).reduce((res, state) => {
			res[state] = new SpriteAnimation(resource, ANIMATION_FRAMES[state].reduce((acc, frame) => {
				const point = start.clone().add(frame);
				acc.push(resource.getTile(point.x, point.y));
				return acc;
			}, []), speed);
			return res;
		}, {});
	}

	/**
	 * Возвращает набор состояний для персонажа
	 * @param animations
	 * @returns {{}}
	 */
	static getAnimationStates(animations) {
		return Object.keys(STATE).reduce((res, state) => {
			res[state] = new AnimationState(state, animations[state], {
				enter() {
				},
				exit() {
				},
				handleEvent(event) {
					// по умолчанию разрешаем переключение состояний на любое другое
					if (Object.values(STATE).includes(event)) {
						this.setState(event);
						return;
					}
					console.warn('Unknown event', event, new Error().stack);
				},
			});
			return res;
		}, {});
	}

	/**
	 * Задает направление анимации в зависимости от вектора скорости
	 * @param character {Mob | Character | Player | NPC}
	 */
	static turnToDirection(character) {
		const velocity = character.velocity;
		const velocitySign = velocity.sign();
		const angle = Math.atan2(velocity.y, velocity.x);
		if (velocitySign.x === 0 && velocitySign.y === 0) {
			return;
		}
		const degrees = (angle * 180) / Math.PI;
		if (degrees > -45 && degrees <= 45) {
			character.handleEvent(STATE.WALK_RIGHT);
		} else if (degrees > 45 && degrees <= 135) {
			character.handleEvent(STATE.WALK_BOTTOM);
		} else if (degrees > 135 || degrees <= -135) {
			character.handleEvent(STATE.WALK_LEFT);
		} else {
			character.handleEvent(STATE.WALK_TOP);
		}
	}

	static playAnimationDependOnVelocity(character) {
		const velocitySign = character.velocity;
		if (velocitySign.x === 0 && velocitySign.y === 0) {
			character.stopAnimation();
			return;
		}
		// Иначе воспроизводим анимацию
		character.playAnimation();

	}

	static npsRunMicroTaskIfExist(npc, scope) {
		// Игрок вошел в зону видимости
		if(npc.vision.hasIntersectedInCurrentFrameWithType(COLLIDER_TYPE.PLAYER)) {
			npc.runMicroTask(scope, {
				currentNPC: npc,
			});
		}
	}

	/**
	 * Возвращает состояния, которые есть по умолчанию у всех существ
	 * @param resource {ImageLoader}
	 * @param vector {Vector2}
	 * @param [animationSpeed] {number}
	 * @returns {{}}
	 */
	static getDefaultStates(resource, vector, animationSpeed = undefined) {
		const ANIMATION = GameLogic.getAnimations(resource, vector, animationSpeed);
		return GameLogic.getAnimationStates(ANIMATION);
	}
}
