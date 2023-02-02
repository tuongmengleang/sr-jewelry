<script lang="ts" setup>
import { useDropZone } from '@vueuse/core'
import { useCompressor } from '~/composables/useCompressor'

/* emit */
const emit = defineEmits(['onChange', 'onCompress'])

/* vars */
const dropZoneRef = ref<HTMLDivElement>()
const FileInput = ref<HTMLInputElement>()
const { $isImage } = useNuxtApp()

/* methods */
function onDrop(_files: File[] | null): void {
  // called when files are dropped on zone
  onChange(_files)
}

async function onChange(_files: File[] | null): Promise<void> {
  if (!FileInput.value) return

  const fs: any = _files && _files.length > 0 ? _files : FileInput.value.files
  for (let i = 0; i < fs.length; i++) {
    if (!$isImage(fs[i])) console.log('Not allow file extension:' + fs[i].name)
    else {
      emit('onChange', fs[i])
      emit('onCompress', await useCompressor(fs[i]), i)
    }
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div class="filepond">
    <div
      ref="dropZoneRef"
      class="filepond-container"
      :class="{ dropped: isOverDropZone }"
      @click=";($refs.FileInput as HTMLInputElement).click()"
    >
      <input
        ref="FileInput"
        type="file"
        multiple
        class="hidden"
        @change="onChange([])"
      />
      <div class="text-base font-medium text-center">
        <IconMingcute:upload-3-fill
          class="text-4xl text-gray-400 mx-auto mb-3 transition-all duration-300 transform"
          :class="{ 'scale-125': isOverDropZone }"
        />
        <h6 class="text-gray-700">
          ទម្លាក់រូបភាពរបស់អ្នកនៅទីនេះ ឬ
          <a
            class="font-semibold text-primary hover:underline cursor-pointer"
            @click=";($refs.FileInput as HTMLInputElement).click()"
          >
            ចុចទីនេះ
          </a>
        </h6>
        <span class="text-gray-500">ទំហំរូបភាពធំបំផុត: 20 MB</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filepond {
  @apply relative w-full cursor-pointer;
  &-container {
    @apply flex items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 hover:border-primary-600;
    &.dropped {
      @apply border-primary-600;
    }
  }
}
</style>
