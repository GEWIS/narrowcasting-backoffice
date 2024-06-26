<template>
  <Panel :header="header.toUpperCase()" class="card">
    <template #icons>
      <slot name="topAction" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot name="default" />
    <template v-if="action" #footer>
      <Button severity="secondary" id="bottom-left-button" @click="handleClick">{{
        action.toUpperCase()
      }}</Button>
    </template>
  </Panel>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { defineSlots } from 'vue';

const props = defineProps({
  header: {
    type: String,
    required: true
  },
  routerLink: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: false
  },
  func: {
    type: Function,
    required: false
  }
});

defineSlots<{
  topAction?: any;
  header?: any;
  default: any;
}>();

const router = useRouter();
const handleClick = () => {
  if (props.routerLink) {
    // If routerLink is defined, use router.push to navigate
    router.push({ name: props.routerLink });
  } else if (props.func) {
    // If routerLink is not defined and func is provided, execute the func
    props.func();
  }
};
</script>

<style scoped lang="scss">
#bottom-left-button {
  width: 100%;
  color: #c40000 !important;
  background-color: #f2f2f2;
  padding: 1rem 1.25rem;
  font-family: Lato, Arial, sans-serif !important;
  font-weight: 400;
  border: none #dee2e6;
}

:deep(.p-panel-header) {
  color: #c40000 !important;
  font-family: Lato, Arial, sans-serif !important;
  font-weight: 400;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  background-color: #f8f8f8 !important;
}

:deep(.p-panel-content) {
  background-color: #f8f8f8 !important;
  padding: 1rem 2rem !important;
}

:deep(.p-panel-footer) {
  padding: 0 !important;
}

.card {
  color: #d40000 !important;
  position: relative;
}

:deep(.p-panel-header .p-panel-title) {
  padding: 1.25rem 0;
}
</style>
