import { Butler as BUTLER } from "../butler.js";

export default class EnhancedEffectConfig extends ActiveEffectConfig {
	get title() {
		const reference = this.document.name ? ` ${game.i18n.localize(this.document.name)}` : "";
		return `${game.i18n.localize(this.document.constructor.metadata.label)}${reference}`;
	}

	/** @override */
	async getData(options = {}) {
		const context = await DocumentSheet.prototype.getData.call(this, options);
		context.descriptionHTML = await TextEditor.enrichHTML(this.object.description, {
			async: true,
			secrets: this.object.isOwner,
		});
		const legacyTransfer = CONFIG.ActiveEffect.legacyTransferral;
		const labels = {
			transfer: {
				name: game.i18n.localize(`EFFECT.Transfer${legacyTransfer ? "Legacy" : ""}`),
				hint: game.i18n.localize(`EFFECT.TransferHint${legacyTransfer ? "Legacy" : ""}`),
			},
		};
		const data = {
			labels,
			effect: this.object, // Backwards compatibility
			data: this.object,
			isActorEffect: true,
			isItemEffect: false,
			submitText: "EFFECT.Submit",
			modes: Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((obj, e) => {
				obj[e[1]] = game.i18n.localize(`EFFECT.MODE_${e[0]}`);
				return obj;
			}, {}),
		};
		return foundry.utils.mergeObject(context, data);
	}

	/**
	 * Override default update object behaviour
	 * @param {*} formData
	 * @override
	 */
	async _updateObject(event, formData) {
		const conditionIdFlag = getProperty(
			this.object.flags,
			`${BUTLER.NAME}.${BUTLER.FLAGS.enhancedConditions.conditionId}`,
		);
		if (!conditionIdFlag) return;

		// find the matching condition row
		const map = ui.clt?.conditionLab?.map;

		if (!map && !map.length) return;

		const conditionId = conditionIdFlag.replace(`${BUTLER.NAME}.`, "");
		const condition = map.find((c) => c.id === conditionId);

		if (!condition) return;

		// update the effect data

		condition.activeEffect = condition.activeEffect ? mergeObject(condition.activeEffect, formData) : formData;

		this.object.updateSource(formData);
		if (this._state == 2) await this.render();
		if (ui.clt.conditionLab) {
			ui.clt.conditionLab.map = ui.clt.conditionLab.updatedMap;
			//ui.clt.conditionLab.unsaved = true;
			ui.clt.conditionLab.render();
		}
	}
}
