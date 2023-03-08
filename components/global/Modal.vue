<script lang="ts" setup>
import {
  TransitionRoot,
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
const props: any = defineProps<{
  modelValue: boolean
  outsideClose?: boolean
  size?: string
}>()

const sizes = reactive<{
  [key: string]: string
}>({
  a4: 'max-w-[21cm] !p-0 rounded-xl overflow-auto',
  '2xl': 'max-w-2xl',
  xl: 'max-w-xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xs: 'max-w-xs',
})
const selectedSize = computed(() => sizes[props.size] || sizes.md)

const emit = defineEmits(['update:modelValue'])

const modelValue = useSyncProps<boolean>(props, 'modelValue', emit)

const closeModal = (): void => {
  if (props.outsideClose) modelValue.value = false
}
</script>
<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="`${selectedSize} w-full transform rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all`"
            >
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
