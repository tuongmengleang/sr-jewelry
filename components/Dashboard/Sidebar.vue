<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { useUI } from '~/stores/ui'

interface IMenu {
  title: string
  route: string
  icon: string
}
const menus = computed((): IMenu[] => [
  {
    title: 'ផ្ទាំងគ្រប់គ្រង',
    route: 'dashboard',
    icon: 'ic:outline-space-dashboard',
  },
  {
    title: 'អតិថិជន',
    route: 'customers',
    icon: 'lucide:users',
  },
  {
    title: 'ផលិតផល',
    route: 'products',
    icon: 'map:jewelry-store',
  },
  {
    title: 'ការបញ្ជាទិញ',
    route: 'orders',
    icon: 'mingcute:shopping-cart-2-line',
  },
])

const ui = useUI()
const route = useRoute()
const router = useRouter()
const sidebar = ref<HTMLElement>()

onClickOutside(sidebar, (event) => ui.updateShowDrawer(false))

// watch
watch(
  () => route.name,
  () => {
    setTimeout(() => {
      ui.updateShowDrawer(false)
    }, 200)
  }
)

/* methods */
const isSubMenuActive = (parentRoute: string) => {
  const paths = Array.isArray(parentRoute) ? parentRoute : [parentRoute]
  return paths.some((path) => {
    return route.path.indexOf(path) === 0 // current path starts with this path string
  })
}
</script>

<template>
  <nav ref="sidebar" class="sidebar" :class="{ open: ui.showDrawer }">
    <div class="sidebar-inner">
      <div class="sidebar-header">
        <img class="sidebar-logo" src="/assets/logo.webp" alt="SR Jewelry" />
        <h2 class="ml-4 text-xl font-semibold">SR Jewelry</h2>
      </div>

      <ul class="sidebar-menu">
        <li v-for="(menu, i) in menus" :key="i">
          <RouterLink
            :to="{ name: menu.route }"
            :class="{ active: isSubMenuActive(`/${menu.route}`) }"
          >
            <Icon :name="menu.icon" class="w-5 h-5" />
            <span>{{ menu.title }}</span>
          </RouterLink>
        </li>
      </ul>
      <div class="hidden mt-auto w-full px-3 pb-5"></div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.sidebar {
  @apply fixed inset-0 w-[250px] h-full border-r shadow bg-gray-50 -left-[250px] lg:left-0 transition-all duration-300 z-50;

  &.open {
    @apply left-0;
  }

  &-inner {
    @apply w-full h-full flex flex-col;
  }

  &-header {
    @apply flex items-center p-3;
  }

  &-logo {
    @apply w-10 h-10 rounded-full;
  }

  &-menu {
    @apply flex flex-col gap-y-1 px-2 pt-10;

    li {
      @apply;
      a {
        @apply inline-block flex items-center gap-x-3 px-3 py-2 text-gray-800 rounded-xl font-medium hover:bg-gray-100 hover:text-gray-900 cursor-pointer;
        &.router-link-active,
        &.active {
          @apply bg-primary-600 shadow-md shadow-gray-300 text-white;
        }
      }
    }
  }
}
</style>
