import { EnhancedConditions } from "./enhanced-conditions/enhanced-conditions.js";
import { Concentrator } from "./concentrator.js";

export class Butler {
	/** Flags */
	static NAME = "condition-lab-triggler";
	/** Message output */
	static TITLE = "Condition Lab & Triggler";

	static PATH = `modules/${this.NAME}`;

	static get DEFAULT_CONFIG() {
		return {
			enhancedConditions: {
				iconPath: `${this.PATH}/icons/`,
				conditionMapsPath: `${this.PATH}/condition-maps`,
				outputChat: false,
				outputCombat: false,
				removeDefaultEffects: false,
				mapTypes: {
					default: game.i18n.localize("CLT.SETTINGS.EnhancedConditions.MapType.Choices.default"),
					custom: game.i18n.localize("CLT.SETTINGS.EnhancedConditions.MapType.Choices.custom"),
					other: game.i18n.localize("CLT.SETTINGS.EnhancedConditions.MapType.Choices.other"),
				},
				referenceTypes: [
					{
						id: "journalEntry",
						name: "Journal",
						icon: `fas fa-book-open`,
					},
					{
						id: "compendium.journalEntry",
						name: "Journal (C)",
						icon: `fas fa-atlas`,
					},
					{
						id: "item",
						name: "Item",
						icon: `fas fa-suitcase`,
					},
					{
						id: "compendium.item",
						name: "Item (C)",
						icon: `fas fa-suitcase`,
					},
				],
				templates: {
					conditionLab: `${this.PATH}/templates/condition-lab.hbs`,
					chatOutput: `${this.PATH}/templates/chat-conditions.hbs`,
					chatConditionsPartial: `${this.PATH}/templates/partials/chat-card-condition-list.hbs`,
					importDialog: `${this.PATH}/templates/import-conditions.html`,
					macroConfig: `${this.PATH}/templates/enhanced-condition-macro-config.hbs`,
					triggerConfig: `${this.PATH}/templates/enhanced-condition-trigger-config.hbs`,
					optionConfig: `${this.PATH}/templates/enhanced-condition-option-config.hbs`,
				},
				migrationVersion: "",
				specialStatusEffects: {
					blinded: {
						optionProperty: "blindToken",
					},
					invisible: {
						optionProperty: "markInvisible",
					},
				},
			},
			concentrator: {
				conditionName: "Concentrating",
				enable: false,
				outputChat: false,
				promptRoll: false,
				autoConcentrate: false,
				autoEndConcentration: false,
				notifyConcentration: {
					none: "No one",
					gm: "GM & Owner/s",
					all: "Everyone"
				},
				notifyConcentrationCheck: {
					none: "No one",
					gm: "GM & Owner/s",
					all: "Everyone"
				},
				notifyDouble: {
					none: "No one",
					gm: "GM & Owner/s",
					all: "Everyone"
				},
				notifyEndConcentration: {
					none: "No one",
					gm: "GM & Owner/s",
					all: "Everyone"
				},
				icon: "${this.PATH}/icons/concentrating.svg",
				alias: "Concentrator",
				concentrationStatuses: {
					breaking: "breaking",
					active: "active",
					broken: "broken"
				},
				messageVisibility: {
					gmOwner: "GM And Owner",
					all: "All"
				}
			},
			tokenUtility: {
				autoRollHP: false,
				hideAutoRoll: false,
				effectSize: {
					xLarge: {
						multiplier: 5,
						divisor: 2,
					},
					large: {
						multiplier: 3.3,
						divisor: 3,
					},
					medium: {
						multiplier: 2.5,
						divisor: 4,
					},
					small: {
						multiplier: 2,
						divisor: 5,
					},
				},
				effectSizeChoices: {
					small: game.i18n.localize("CLT.SETTINGS.TokenUtility.TokenEffectSize.choices.small"),
					medium: game.i18n.localize("CLT.SETTINGS.TokenUtility.TokenEffectSize.choices.medium"),
					large: game.i18n.localize("CLT.SETTINGS.TokenUtility.TokenEffectSize.choices.large"),
					xLarge: game.i18n.localize("CLT.SETTINGS.TokenUtility.TokenEffectSize.choices.xLarge"),
				},
			},
			triggler: {
				flags: {
					macro: "macroTrigger",
				},
				operators: {
					eq: "=",
					ne: "≠",
					lt: "<",
					lteq: "≤",
					gt: ">",
					gteq: "≥",
				},
				options: {
					percent: "%",
				},
				templates: {
					triggerForm: `${this.PATH}/templates/triggler-form.html`,
					macroTriggerSelect: `${this.PATH}/templates/trigger-select.html`,
				},
			},
		};
	}

	static FLAGS = {
		concentrator: {
			chatMessage: "concentratorChatMessageParsed",
			damageTaken: "damageWasTaken",
			damageAmount: "damageAmount",
			isDead: "isDead",
			updateProcessed: "concentrationUpdateProcessed",
			concentrationSpell: "concentrationSpell"
		},
		enhancedConditions: {
			conditionId: "conditionId",
			overlay: "overlay",
		},
	};

	static SETTING_KEYS = {
		migration: {
			hasRunMigration: "hasRunMigration",
		},
		enhancedConditions: {
			menu: "enchantedConditionsMenu",
			coreIcons: "coreStatusIcons",
			coreEffects: "coreStatusEffects",
			map: "activeConditionMap",
			defaultMaps: "defaultConditionMaps",
			mapType: "conditionMapType",
			removeDefaultEffects: "removeDefaultEffects",
			outputChat: "conditionsOutputToChat",
			outputCombat: "conditionsOutputDuringCombat",
			migrationVersion: "enhancedConditionsMigrationVersion",
			showSortDirectionDialog: "showSortDirectionDialog",
			defaultSpecialStatusEffects: "defaultSpecialStatusEffects",
			specialStatusEffectMapping: "specialStatusEffectMapping",
		},
		concentrator: {
			enable: "enableConcentrator",
			conditionName: "concentratorConditionName",
			outputChat: "concentratorOutputToChat",
			autoConcentrate: "autoConcentrate",
			autoEndConcentration: "autoEndConcentration",
			concentrationAttribute: "concentrationAttribute",
			notifyConcentration: "notifyConcentration",
			notifyConcentrationCheck: "notifyConcentrationCheck",
			notifyDouble: "notifyDoubleConcentration",
			notifyEndConcentration: "notifyEndConcentration",
			healthAttribute: "concentratorHealthAttribute", //validate necessity
			prompt: "concentratorPromptPlayer",
			hideNpcConcentration: "hideNPCConcentration"
		},
		tokenUtility: {
			effectSize: "effectSize",
		},
		triggler: {
			menu: "trigglerMenu",
			triggers: "storedTriggers",
		},
		sceneControls: "sceneControls",
	};

	/**
	 * Stores information about well known game systems. All other systems will resolve to "other"
	 * Keys must match id
	 */
	static KNOWN_GAME_SYSTEMS = {
		dnd5e: {
			id: "dnd5e",
			name: "Dungeons & Dragons 5th Edition",
			concentrationAttribute: "con",
			healthAttribute: "attributes.hp",
			initiative: "attributes.initiative"
		},
		pf1: {
			id: "pf1",
			name: "Pathfinder",
			concentrationAttribute: "",
			healthAttribute: "attributes.hp",
			initiative: "attributes.init.total"
		},
		pf2e: {
			id: "pf2e",
			name: "Pathfinder 2nd Edition",
			concentrationAttribute: "",
			healthAttribute: "attributes.hp",
			initiative: "attributes.perception"
		},
		wfrp4e: {
			id: "wfrp4e",
			name: "Warhammer Fantasy Roleplaying Game 4th Edition",
			concentrationAttribute: "",
			healthAttribute: "status.wounds",
			initiative: "characteristics.i"
		},
		archmage: {
			id: "archmage",
			name: "13th Age",
			concentrationAttribute: "",
			healthAttribute: "attributes.hp",
			initiative: "attributes.init.mod"
		},
		ironclaw2e: {
			id: "ironclaw2e",
			name: "Ironclaw Second Edition",
			concentrationAttribute: "",
			healthAttribute: "",
			initiative: ""
		},
		"cyberpunk-red-core": {
			id: "cyberpunk-red-core",
			name: "Cyberpunk Red Core"
		},
		other: {
			id: "other",
			name: "Custom/Other",
			concentrationAttribute: "--Unknown--",
			healthAttribute: "--Unknown--",
			initiative: "--Unknown--"
		}
	};

	static GADGETS = {
		giveXP: {
			name: "Award XP",
			info: "Provides an end of combat prompt to distribute XP from defeated hostile combatants.",
			wiki: `${WIKIPATH}/award-xp`
		},
		concentrator: {
			name: "Concentrator",
			info: "Manages Concentration in the dnd5e game system.",
			wiki: `${WIKIPATH}/concentrator`
		},
		enhancedConditions: {
			name: "Enhanced Conditions",
			info: "Provides the ability to map Conditions to Status Effect icons",
			wiki: `${WIKIPATH}/enhanced-conditions`
		},
		hideNames: {
			name: "Hide Names",
			info: "Replaces Actor names with a new name of your choice",
			wiki: `${WIKIPATH}/hide-names`
		},
		panSelect: {
			name: "Pan/Select",
			info: "Automatic panning and selection of tokens during combat",
			wiki: `${WIKIPATH}/pan-select`
		},
		rerollInitiative: {
			name: "Reroll Initiative",
			info: "Rerolls Initiative on each Combat round change",
			wiki: `${WIKIPATH}/reroll-initiative`
		},
		tempCombatants: {
			name: "Temporary Combatants",
			info: "Allows the creation of temporary combatants to track things like environmental or lair actions",
			wiki: `${WIKIPATH}/temporary-combatants`
		},
		triggler: {
			name: "Triggler",
			info: "A trigger-management system for token/actor attribute changes",
			wiki: `${WIKIPATH}/triggler`
		},
		actorUtility: {
			name: "Misc Actor",
			info: "Miscellaneous Actor enhancements",
			wiki: `${WIKIPATH}/actor-misc`
		},
		tokenUtility: {
			name: "Misc Token",
			info: "Miscellaneous Token enhancements",
			wiki: null
		}
	};

	// Instantiate gadget classes
	enhancedConditions = new EnhancedConditions();
	concentrator = new Concentrator();

	// Expose API methods
	getCondition = EnhancedConditions.getCondition;
	getConditions = EnhancedConditions.getConditions;
	getConditionEffects = EnhancedConditions.getConditionEffects;
	hasCondition = EnhancedConditions.hasCondition;
	applyCondition = EnhancedConditions.applyCondition;
	addCondition = EnhancedConditions.addCondition;
	removeCondition = EnhancedConditions.removeCondition;
	removeAllConditions = EnhancedConditions.removeAllConditions;
}
