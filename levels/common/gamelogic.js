'use strict';

// В случае если персонаж приближается к NPC тот смотрит в сторону персонажа
import {COLLIDER_TYPE} from "./constants.js";
import {ImageLoader, SpriteAnimation, Vector2, AnimationState} from "../../GameEngine";
import {STATE} from "./states.js";
import {ANIMATION_FRAMES} from "./aminationFrames.js";

export class GameLogic {
	/**
	 * Поворачивает NPC в сторону персонажа
	 * @param npc
	 * @param defaultState
	 */
	static npcLookAtPlayer(npc, defaultState = STATE.IDLE_BOTTOM) {
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
		npc.handleEvent(defaultState);
	}

	static npc

	/**
	 * Возвращает набор анимаций для персонажа
	 * @param resource {ImageLoader} - Sprite Sheet
	 * @param start {Vector2} - Начальная точка на spritesheet'е
	 */
	static getAnimations(resource, start) {
		if(!(resource instanceof ImageLoader)) throw new TypeError('resource must be ImageLoader');
		if(!(start instanceof Vector2)) throw new TypeError('start must be Vector2');
		return Object.keys(STATE).reduce((res, state) => {
			res[state] = new SpriteAnimation(resource, ANIMATION_FRAMES[state].reduce((acc, frame) => {
				const point = start.clone().add(frame);
				acc.push(resource.getTile(point.x, point.y));
				return acc;
			}, []));
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
				enter() {},
				exit() {},
				handleEvent(event) {
					// по умолчанию разрешаем переключение состояний на любое другое
					if(Object.values(STATE).includes(event)) {
						this.setState(event);
						return;
					}
					console.warn('Unknown event', event, new Error().stack);
				},
			});
			return res;
		}, {});
	}
}
