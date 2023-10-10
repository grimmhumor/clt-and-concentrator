import { Butler as BUTLER } from "./butler.js";
import { ConditionLab } from "./enhanced-conditions/condition-lab.js";
import { EnhancedConditions } from "./enhanced-conditions/enhanced-conditions.js";
import { Sidekick } from "./sidekick.js";
import { TrigglerForm } from "./triggler/triggler-form.js";
import {Concentrator} from "./concentrator";

export function registerSettings() {
	/* -------------------------------------------- */
	/*            Setting Configuration             */
	/* -------------------------------------------- */

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.outputChat, {
		name: "CLT.SETTINGS.EnhancedConditions.OutputChatN",
		hint: "CLT.SETTINGS.EnhancedConditions.OutputChatH",
		scope: "world",
		type: Boolean,
		config: true,
		default: BUTLER.DEFAULT_CONFIG.enhancedConditions.outputChat,
		onChange: (s) => {
			if (s === true) {
				const dialog = Dialog.confirm({
					title: game.i18n.localize(`CLT.ENHANCED_CONDITIONS.OutputChatConfirm.Title`),
					content: game.i18n.localize(`CLT.ENHANCED_CONDITIONS.OutputChatConfirm.Content`),
					yes: () => {
						const newMap = deepClone(game.clt.conditions);
						if (!newMap.length) return;
						newMap.forEach((c) => (c.options.outputChat = true));
						Sidekick.setSetting(BUTLER.SETTING_KEYS.enhancedConditions.map, newMap);
					},
					no: () => {},
				});
			}
		},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.outputCombat, {
		name: "CLT.SETTINGS.EnhancedConditions.OutputCombatN",
		hint: "CLT.SETTINGS.EnhancedConditions.OutputCombatH",
		scope: "world",
		type: Boolean,
		config: true,
		default: BUTLER.DEFAULT_CONFIG.enhancedConditions.outputCombat,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.removeDefaultEffects, {
		name: "CLT.SETTINGS.EnhancedConditions.RemoveDefaultEffectsN",
		hint: "CLT.SETTINGS.EnhancedConditions.RemoveDefaultEffectsH",
		scope: "world",
		type: Boolean,
		config: true,
		default: BUTLER.DEFAULT_CONFIG.enhancedConditions.removeDefaultEffects,
		onChange: (s) => {
			EnhancedConditions._updateStatusEffects();
		},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.migrationVersion, {
		name: `CLT.SETTINGS.EnhancedConditions.MigrationVersionN`,
		hint: `CLT.SETTINGS.EnhancedConditions.MigrationVersionH`,
		scope: "world",
		type: String,
		config: false,
		apiOnly: true,
		default: BUTLER.DEFAULT_CONFIG.enhancedConditions.migrationVersion,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.showSortDirectionDialog, {
		name: `CLT.SETTINGS.EnhancedConditions.ShowSortDirectionDialogN`,
		hint: `CLT.SETTINGS.EnhancedConditions.ShowSortDirectionDialogH`,
		scope: "world",
		type: Boolean,
		config: true,
		default: true,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.defaultSpecialStatusEffects, {
		name: `CLT.SETTINGS.EnhancedConditions.DefaultSpecialStatusEffectsN`,
		hint: `CLT.SETTINGS.EnhancedConditions.DefaultSpecialStatusEffectsH`,
		scope: "world",
		type: Object,
		default: {},
		config: false,
		onChange: () => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.specialStatusEffectMapping, {
		name: `CLT.SETTINGS.EnhancedConditions.SpecialStatusEffectMappingN`,
		hint: `CLT.SETTINGS.EnhancedConditions.SpecialStatusEffectMappingH`,
		scope: "world",
		type: Object,
		default: {},
		config: false,
		onChange: () => {},
	});

	/* -------------------------------------------- */
	/*                 Concentrator                 */
	/* -------------------------------------------- */

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.enable, {
		name: "CLT.SETTINGS.Concentrator.EnableN",
		hint: "CLT.SETTINGS.Concentrator.EnableH",
		default: BUTLER.DEFAULT_CONFIG.concentrator.enable,
		scope: "world",
		type: Boolean,
		config: true,
		onChange: s => {
			if (s) {
				const enhancedConditionsEnabled = Sidekick.getSetting(BUTLER.SETTING_KEYS.enhancedConditions.enable);

				enhancedConditionsEnabled ? Concentrator._createCondition() : Concentrator._promptEnableEnhancedConditions();
			}
		}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.conditionName, {
		name: "CLT.SETTINGS.Concentrator.ConditionNameN",
		hint: "CLT.SETTINGS.Concentrator.ConditionNameH",
		default: BUTLER.DEFAULT_CONFIG.concentrator.conditionName,
		scope: "world",
		type: String,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.concentrationAttribute, {
		name: "CLT.SETTINGS.Concentrator.ConcentrationAttributeN",
		hint: "CLT.SETTINGS.Concentrator.ConcentrationAttributeH",
		default: BUTLER.KNOWN_GAME_SYSTEMS[game.system.id] ? BUTLER.KNOWN_GAME_SYSTEMS[game.system.id].concentrationAttribute : BUTLER.KNOWN_GAME_SYSTEMS.other.concentrationAttribute,
		scope: "world",
		type: String,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.healthAttribute, {
		name: "CLT.SETTINGS.Concentrator.HealthAttributeN",
		hint: "CLT.SETTINGS.Concentrator.HealthAttributeH",
		default: BUTLER.KNOWN_GAME_SYSTEMS[game.system.id] ? BUTLER.KNOWN_GAME_SYSTEMS[game.system.id].healthAttribute : BUTLER.KNOWN_GAME_SYSTEMS.other.healthAttribute,
		scope: "world",
		type: String,
		config: true,
		onChange: s => {}
	});


	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.prompt, {
		name: "CLT.SETTINGS.Concentrator.PromptRollN",
		hint: "CLT.SETTINGS.Concentrator.PromptRollH",
		default: BUTLER.DEFAULT_CONFIG.concentrator.promptRoll,
		scope: "world",
		type: Boolean,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.autoConcentrate, {
		name: "CLT.SETTINGS.Concentrator.AutoConcentrateN",
		hint: "CLT.SETTINGS.Concentrator.AutoConcentrateH",
		default: BUTLER.DEFAULT_CONFIG.concentrator.autoConcentrate,
		scope: "world",
		type: Boolean,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.autoEndConcentration, {
		name: `CLT.SETTINGS.CONCENTRATOR.AutoEndConcentrationN`,
		hint: `CLT.SETTINGS.CONCENTRATOR.AutoEndConcentrationH`,
		default: BUTLER.DEFAULT_CONFIG.concentrator.autoEndConcentration,
		scope: "world",
		type: Boolean,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.notifyConcentration, {
		name: `CLT.SETTINGS.CONCENTRATOR.NotifyConcentrationN`,
		hint: `CLT.SETTINGS.CONCENTRATOR.NotifyConcentrationH`,
		default: Sidekick.getKeyByValue(BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentration, BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentration.none),
		scope: "world",
		type: String,
		choices: BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentration,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.notifyConcentrationCheck, {
		name: `CLT.SETTINGS.CONCENTRATOR.NotifyConcentrationCheckN`,
		hint: `CLT.SETTINGS.CONCENTRATOR.NotifyConcentrationCheckH`,
		default: Sidekick.getKeyByValue(BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentrationCheck, BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentrationCheck.none),
		scope: "world",
		type: String,
		choices: BUTLER.DEFAULT_CONFIG.concentrator.notifyConcentrationCheck,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.notifyDouble, {
		name: "SETTINGS.Concentrator.NotifyDoubleN",
		hint: "SETTINGS.Concentrator.NotifyDoubleH",
		default: Sidekick.getKeyByValue(BUTLER.DEFAULT_CONFIG.concentrator.notifyDouble, BUTLER.DEFAULT_CONFIG.concentrator.notifyDouble.none),
		scope: "world",
		type: String,
		choices: BUTLER.DEFAULT_CONFIG.concentrator.notifyDouble,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.notifyEndConcentration, {
		name: `CLT.SETTINGS.CONCENTRATOR.NotifyEndN`,
		hint: `CLT.SETTINGS.CONCENTRATOR.NotifyEndN`,
		default: Sidekick.getKeyByValue(BUTLER.DEFAULT_CONFIG.concentrator.notifyEndConcentration, BUTLER.DEFAULT_CONFIG.concentrator.notifyEndConcentration.none),
		scope: "world",
		type: String,
		choices: BUTLER.DEFAULT_CONFIG.concentrator.notifyEndConcentration,
		config: true,
		onChange: s => {}
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.concentrator.hideNpcConcentration, {
		name: `CLT.SETTINGS.CONCENTRATOR.HideNPCConcentrationN`,
		hint: `CLT.SETTINGS.CONCENTRATOR.HideNPCConcentrationH`,
		scope: "world",
		type: Boolean,
		default: false,
		config: true,
		onChange: s => {}
	});

	/* -------------------------------------------- */
	/*              EnhancedConditions              */
	/* -------------------------------------------- */

	Sidekick.registerMenu(BUTLER.SETTING_KEYS.enhancedConditions.menu, {
		name: "CLT.ENHANCED_CONDITIONS.Lab.Title",
		label: "CLT.ENHANCED_CONDITIONS.Lab.Title",
		hint: "CLT.ENHANCED_CONDITIONS.Lab.Hint",
		icon: "fas fa-flask",
		type: ConditionLab,
		restricted: true,
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.coreIcons, {
		name: "CLT.SETTINGS.EnhancedConditions.CoreIconsN",
		hint: "CLT.SETTINGS.EnhancedConditions.CoreIconsH",
		scope: "world",
		type: Object,
		default: [],
		config: false,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.coreEffects, {
		name: "CLT.SETTINGS.EnhancedConditions.CoreEffectsN",
		hint: "CLT.SETTINGS.EnhancedConditions.CoreEffectsH",
		scope: "world",
		type: Object,
		default: [],
		config: false,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.mapType, {
		name: "CLT.SETTINGS.EnhancedConditions.MapTypeN",
		hint: "CLT.SETTINGS.EnhancedConditions.MapTypeH",
		scope: "world",
		type: String,
		default: "",
		choices: BUTLER.DEFAULT_CONFIG.enhancedConditions.mapTypes,
		config: false,
		apiOnly: true,
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.defaultMaps, {
		name: "CLT.SETTINGS.EnhancedConditions.DefaultMapsN",
		hint: "CLT.SETTINGS.EnhancedConditions.DefaultMapsH",
		scope: "world",
		type: Object,
		default: {},
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.map, {
		name: "CLT.SETTINGS.EnhancedConditions.ActiveConditionMapN",
		hint: "CLT.SETTINGS.EnhancedConditions.ActiveConditionMapH",
		scope: "world",
		type: Object,
		default: [],
		onChange: async (conditionMap) => {
			await EnhancedConditions._updateStatusEffects(conditionMap);

			// Save the active condition map to a convenience property
			if (game.clt) {
				game.clt.conditions = conditionMap;
			}
		},
	});

	/* -------------------------------------------- */
	/*                 TokenUtility                 */
	/* -------------------------------------------- */

	if (!game.modules.get("status-halo")?.active) {
		Sidekick.registerSetting(BUTLER.SETTING_KEYS.tokenUtility.effectSize, {
			name: "CLT.SETTINGS.TokenUtility.TokenEffectSizeN",
			hint: "CLT.SETTINGS.TokenUtility.TokenEffectSizeH",
			default: "small",
			scope: "client",
			type: String,
			choices: BUTLER.DEFAULT_CONFIG.tokenUtility.effectSizeChoices,
			config: true,
			onChange: (s) => {
				canvas.draw();
			},
		});
	}

	/* -------------------------------------------- */
	/*                    Triggler                  */
	/* -------------------------------------------- */

	Sidekick.registerMenu(BUTLER.SETTING_KEYS.triggler.menu, {
		name: "CLT.SETTINGS.Triggler.TriggersN",
		label: "CLT.SETTINGS.Triggler.TriggersN",
		hint: "CLT.SETTINGS.Triggler.TriggersH",
		icon: "fas fa-exclamation",
		type: TrigglerForm,
		restricted: true,
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.triggler.triggers, {
		name: "CLT.SETTINGS.Triggler.TriggersN",
		hint: "CLT.SETTINGS.Triggler.TriggersH",
		scope: "world",
		type: Object,
		default: [],
		onChange: (s) => {},
	});

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.migration.hasRunMigration, {
		scope: "world",
		type: Boolean,
		default: false,
	});

	/* -------------------------------------------- */

	Sidekick.registerSetting(BUTLER.SETTING_KEYS.sceneControls, {
		name: "CLT.SETTINGS.SceneControls.Name",
		hint: "CLT.SETTINGS.SceneControls.Hint",
		scope: "world",
		type: Boolean,
		default: false,
		config: true,
		requiresReload: true,
	});
}
