<script lang="ts" setup>
import useToast from '~/composables/useToast'
import { useCompressor } from '~/composables/useCompressor'

const props = defineProps({
  modelValue: {
    type: null,
    default: '',
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const modelValue: any = useSyncProps<string>(props, 'modelValue', emit)

const { $isImage } = useNuxtApp()
const image = ref('')

const fileInput = ref()
const onChange = async (): Promise<void> => {
  if (!fileInput.value) return

  const file = fileInput.value.files[0]
  if (!$isImage(file)) useToast().error('ប្រភេទឯកសារមិនអនុញ្ញាត!')
  else {
    image.value = URL.createObjectURL(file)
    modelValue.value = await useCompressor(file)
    // modelValue.value = file
  }
}

const onClear = () => {
  image.value = ''
  fileInput!.value = null
  modelValue.value = ''
}

defineExpose({
  onClear,
})
</script>

<template>
  <div class="profile-wrap">
    <!--    accept="image/png, image/jpg, image/jpeg, image/webp"-->
    <input ref="fileInput" type="file" class="hidden" @change="onChange" />
    <a
      v-if="!image"
      class="profile-upload"
      title="Upload Image"
      @click=";($refs.fileInput as HTMLInputElement).click()"
    >
      <IconMaterial-symbols:add-photo-alternate class="text-lg text-white" />
    </a>
    <a
      v-else
      class="profile-upload danger"
      title="Remove Image"
      @click="onClear"
    >
      <IconOcticon:trash-16 class="text-lg text-gray-800" />
    </a>
    <img v-if="image" :src="image" alt="" />
    <img v-else src="~/assets/images/profile.png" alt="profile placeholder" />
  </div>
</template>

<style scoped lang="scss">
.profile-wrap {
  @apply relative w-30 h-30 border shadow rounded-full;

  .profile-upload {
    @apply absolute right-1 bottom-1 p-1.5 rounded-full bg-gray-500 bg-opacity-80 hover:bg-gray-600 hover:bg-opacity-80 cursor-pointer;
    &.danger {
      @apply bg-red-300 bg-opacity-80 hover:bg-red-400 hover:bg-opacity-80;
    }
  }

  img {
    @apply w-full h-full rounded-full object-cover;
  }
}
</style>
