<script lang="ts" setup>
// imports
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUI } from '~/stores/ui'
import { useSticky } from '~/composables/useSticky'

// vars
const router = useRouter()
const ui = useUI()
const navbar = ref(null)
const client = useSupabaseAuthClient()
const user = useSupabaseUser()

// lifecycle
let timer: NodeJS.Timer
// mounted
onMounted(() => {
  if (!navbar.value) return

  // scroll
  const { onScroll } = useSticky(navbar.value, 0)
  setTimeout(() => onScroll(), 50)
})
// before-mounted
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const onLogOut = async (): Promise<void> => {
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error
    user.value = null
  } catch (error: any) {
    console.log(error.message)
  } finally {
    router.push({ name: 'index' })
  }
}
</script>

<template>
  <nav
    ref="navbar"
    class="w-full top-0 p-3 flex-none transition-colors duration-300 bg-white z-50"
  >
    <div class="h-[50px] flex items-center px-3 shadow border rounded-lg">
      <a
        class="inline-block lg:hidden cursor-pointer"
        @click="ui.updateShowDrawer(true)"
      >
        <IconGg:menu-left-alt />
      </a>
      <a
        v-if="$route.name !== 'dashboard'"
        class="hidden lg:flex items-center justify-center cursor-pointer w-6 h-6 hover:text-gray-700"
        @click="$router.back()"
      >
        <IconMaterial-symbols:arrow-back-ios-rounded />
      </a>
      <div class="flex items-center ml-auto">
        <Menu as="div" class="relative inline-block text-left">
          <MenuButton>
            <Avatar size="34" class="cursor-pointer">
              <img
                src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt=""
              />
            </Avatar>
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 z-50 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    type="button"
                    :class="[
                      active ? 'bg-primary-500 text-white' : 'text-gray-900',
                      'group inline-flex items-center gap-x-2 w-full items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer z-50',
                    ]"
                    @click="onLogOut"
                  >
                    <IconMajesticons:door-exit
                      class="text-lg text-red-500 group-hover:text-white"
                    />
                    ចាកចេញ
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
