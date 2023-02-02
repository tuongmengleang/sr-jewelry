<script lang="ts" setup></script>

<template>
  <main id="main" class="main">
    <slot name="app-before" />
    <div id="app-before"></div>

    <div class="flex w-full min-h-screen">
      <DashboardSidebar />
      <div class="w-full pl-0 lg:pl-[250px]">
        <DashboardNavbar />
        <slot />
      </div>
    </div>

    <slot name="app-after" />
    <div id="app-after"></div>
  </main>
</template>

<style scoped></style>
