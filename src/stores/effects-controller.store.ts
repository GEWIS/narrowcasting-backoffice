import type { LightsEffectsColorCreateParams } from '@/api/Client';
import { defineStore } from 'pinia';
import { Client, LightsGroup, SearchLightCreateParams } from '@/api/Client';

type LightsEffectsMovementCreateParams = SearchLightCreateParams;

export interface PushedEffects {
  timestamp: Date;
  lightGroupIds: number[];
  effects: LightsEffectsColorCreateParams[];
}

interface EffectsControllerStore {
  selectedLightsGroupIds: number[];
  chosenColorEffects: LightsEffectsColorCreateParams[];
  chosenMovementEffects: LightsEffectsMovementCreateParams[];
  pastPushedEffects: PushedEffects[];
}

export const useEffectsControllerStore = defineStore('effectsController', {
  state: (): EffectsControllerStore => ({
    selectedLightsGroupIds: [],
    chosenColorEffects: [],
    chosenMovementEffects: [],
    pastPushedEffects: [],
  }),
  getters: {},
  actions: {
    toggleLightsGroup(id: number) {
      const index = this.selectedLightsGroupIds.findIndex((g) => g === id);
      if (index < 0) {
        this.selectedLightsGroupIds.push(id);
      } else {
        this.selectedLightsGroupIds.splice(index, 1);
      }
    },
    selectAllLightsGroups(groups: LightsGroup[]) {
      this.selectedLightsGroupIds = groups.map((g) => g.id);
    },
    resetLightsGroupSelection() {
      this.selectedLightsGroupIds = [];
    },
    addColorEffect(effect: LightsEffectsColorCreateParams) {
      this.chosenColorEffects.push(effect);
    },
    addMovementEffect(effect: LightsEffectsMovementCreateParams) {
      this.chosenColorEffects.push(effect);
    },
    removeColorEffect(index: number) {
      this.chosenColorEffects.splice(index, 1);
    },
    removeMovementEffect(index: number) {
      this.chosenMovementEffects.splice(index, 1);
    },

    clearEffects() {
      this.chosenColorEffects = [];
      this.chosenMovementEffects = [];
    },
    async sendEffects() {
      const client = new Client();
      await Promise.all(
        this.selectedLightsGroupIds.map(async (id) => {
          await client.applyLightsEffectColor(id, this.chosenColorEffects);
          await client.applyLightsEffectMovement(id, this.chosenMovementEffects);
        })
      );
      this.pastPushedEffects.unshift({
        effects: this.chosenColorEffects,
        lightGroupIds: this.selectedLightsGroupIds,
        timestamp: new Date()
      });
      this.chosenColorEffects = [];
    },
    async enableStrobe() {
      const client = new Client();
      await Promise.all(
        this.selectedLightsGroupIds.map((id) => {
          return client.enableStrobeOnLightsGroup(id, undefined);
        })
      );
    },
    async disableStrobe() {
      const client = new Client();
      await Promise.all(
        this.selectedLightsGroupIds.map((id) => {
          return client.disableStrobeOnLightsGroup(id);
        })
      );
    }
  }
});
