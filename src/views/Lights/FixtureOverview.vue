<template>
  <div class="page-container">
    <div class="page-title">Fixture Overview</div>
    <div>
      <DataTable
        :value="subscriberStore.lightsGroups"
        data-key="id"
        v-model:expanded-rows="expandedRows"
      >
        <template #header>
          <div class="flex flex-wrap justify-content-end gap-2">
            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
          </div>
        </template>
        <Column expander style="width: 5rem" />
        <Column field="name" header="Group name" />
        <Column header="Controller">
          <template #body="slotProps">
            {{ slotProps.data.controller.name }}
          </template>
        </Column>
        <Column header="Current handler">
          <template #body="slotProps">
            <span v-if="activeLightsGroupIds.has(slotProps.data.id)">
              {{ getHandler(slotProps.data.id) }}
            </span>
            <InlineMessage v-else severity="warn">
              No handler set, all actions disabled
            </InlineMessage>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex flex-row gap-1">
              <Button
                size="small"
                title="Freeze"
                :disabled="!activeLightsGroupIds.has(slotProps.data.id)"
                @click="
                  async () => {
                    await LightsService.freezeLightsGroup(slotProps.data.id);
                    toastSuccess({
                      title: 'Success',
                      body: `Successfully froze lights group '${slotProps.data.name}'`
                    });
                  }
                "
              >
                <FontAwesomeIcon :icon="faSnowflake" />
              </Button>
              <Button
                size="small"
                title="Unfreeze"
                :disabled="!activeLightsGroupIds.has(slotProps.data.id)"
                @click="
                  async () => {
                    await LightsService.unfreezeLightsGroup(slotProps.data.id);
                    toastSuccess({
                      title: 'Success',
                      body: `Successfully unfroze lights group '${slotProps.data.name}'`
                    });
                  }
                "
              >
                <FontAwesomeIcon :icon="faFire" />
              </Button>
            </div>
          </template>
        </Column>
        <template #expansion="slotProps">
          <h3>Fixtures for {{ slotProps.data.name }}</h3>
          <DataTable :value="getGroupFixtures(slotProps.data)">
            <Column header="Name">
              <template #body="slotProps2">
                {{ slotProps2.data.fixture.name }}
              </template>
            </Column>
            <Column field="firstChannel" header="DMX Channel" />
            <Column header="Actions">
              <template #body="slotProps2">
                <div class="flex flex-row gap-1">
                  <Button
                    size="small"
                    title="Freeze"
                    :disabled="!activeLightsGroupIds.has(slotProps.data.id)"
                    @click="handleFreeze(slotProps2.data.type, slotProps2.data.id)"
                  >
                    <FontAwesomeIcon :icon="faSnowflake" />
                  </Button>
                  <Button
                    size="small"
                    title="Unfreeze"
                    :disabled="!activeLightsGroupIds.has(slotProps.data.id)"
                    @click="handleUnfreeze(slotProps2.data.type, slotProps2.data.id)"
                  >
                    <FontAwesomeIcon :icon="faFire" />
                  </Button>
                  <Button
                    size="small"
                    title="Hardware reset"
                    :disabled="
                      !activeLightsGroupIds.has(slotProps.data.id) ||
                      !slotProps2.data.fixture.canReset
                    "
                    @click="handleHardwareReset(slotProps2.data.type, slotProps2.data.id)"
                  >
                    <FontAwesomeIcon :icon="faArrowRotateLeft" />
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHandlersStore } from '@/stores/handlers.store';
import { useSubscriberStore } from '@/stores/subscriber.store';
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRotateLeft, faFire, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { type LightsGroupResponse, LightsService } from '@/api';
import { FixtureType } from '@/components/lights/fixtures/FixtureType';
import { toastError, toastSuccess } from '@/utils/toastHandler';

const handlersStore = useHandlersStore();
const subscriberStore = useSubscriberStore();

const expandedRows = ref<Record<number, boolean> | null>({});
const expandAll = () => {
  expandedRows.value = subscriberStore.lightsGroups.reduce(
    (rows: Record<number, boolean>, group: LightsGroupResponse) => (rows[group.id] = true) && rows,
    {}
  );
};
const collapseAll = () => {
  expandedRows.value = null;
};

const getGroupFixtures = (g: LightsGroupResponse) =>
  [
    ...g.pars.map((p) => ({ ...p, type: FixtureType.PAR })),
    ...g.movingHeadRgbs.map((m) => ({ ...m, type: FixtureType.MOVING_HEAD_RGB })),
    ...g.movingHeadWheels.map((m) => ({ ...m, type: FixtureType.MOVING_HEAD_WHEEL }))
  ].sort((a, b) => a.firstChannel - b.firstChannel);

const handleFreeze = async (type: FixtureType, id: number) => {
  try {
    switch (type) {
      case FixtureType.PAR:
        await LightsService.freezeGroupPar(id);
        break;
      case FixtureType.MOVING_HEAD_RGB:
        await LightsService.freezeGroupMovingHeadRgb(id);
        break;
      case FixtureType.MOVING_HEAD_WHEEL:
        await LightsService.freezeGroupMovingHeadWheel(id);
        break;
    }
    toastSuccess({
      title: 'Success',
      body: 'Successfully froze fixture'
    });
  } catch (e: any) {
    toastError(e.message);
  }
};

const handleUnfreeze = async (type: FixtureType, id: number) => {
  try {
    switch (type) {
      case FixtureType.PAR:
        await LightsService.unfreezeGroupPar(id);
        break;
      case FixtureType.MOVING_HEAD_RGB:
        await LightsService.unfreezeMovingHeadRgb(id);
        break;
      case FixtureType.MOVING_HEAD_WHEEL:
        await LightsService.unfreezeMovingHeadWheel(id);
        break;
    }
    toastSuccess({
      title: 'Success',
      body: 'Successfully unfroze fixture'
    });
  } catch (e: any) {
    toastError(e.message);
  }
};

const handleHardwareReset = async (type: FixtureType, id: number) => {
  try {
    switch (type) {
      case FixtureType.PAR:
        await LightsService.resetGroupPar(id);
        break;
      case FixtureType.MOVING_HEAD_RGB:
        await LightsService.resetGroupMovingHeadRgb(id);
        break;
      case FixtureType.MOVING_HEAD_WHEEL:
        await LightsService.resetGroupMovingHeadWheel(id);
        break;
    }
    toastSuccess({
      title: 'Success',
      body: 'Successfully sent hardware reset signal'
    });
  } catch (e: any) {
    toastError(e.message);
  }
};

const getHandler = (groupId: number): string | undefined => {
  return handlersStore.lightsHandlers.find((h) => !!h.entities.find((e) => e.id === groupId))?.name;
};

const activeLightsGroupIds = computed((): Set<number> => {
  const ids = handlersStore.lightsHandlers.map((h) => h.entities.map((e) => e.id)).flat();
  return new Set(ids);
});
</script>

<style scoped></style>
