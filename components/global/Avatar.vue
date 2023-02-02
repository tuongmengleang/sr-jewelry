<script lang="ts" setup>
const props = defineProps({
  size: {
    type: String,
    default: '40',
  },
  circle: {
    type: Boolean,
    default: false,
  },
  history: {
    ype: Boolean,
    default: false,
  },
})

const avatarSize = computed(() => props.size + 'px')
</script>

<template>
  <div class="avatar">
    <slot />
  </div>
</template>

<style lang="scss">
.avatar {
  width: v-bind(avatarSize);
  height: v-bind(avatarSize);
  @apply relative rounded-full overflow-hidden;
  img {
    @apply absolute inset-0 w-full h-full object-cover;
  }
}
</style>
