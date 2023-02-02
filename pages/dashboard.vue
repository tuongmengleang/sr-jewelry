<script setup lang="ts">
definePageMeta({
  layout: 'master',
  middleware: 'auth',
})
</script>

<template>
  <PageWrapper class="py-0 p-4">
    <PageHeader class="lg:px-0">
      <PageTitle class="!text-lg" text="ផ្ទាំងគ្រប់គ្រង" />
    </PageHeader>
    <PageBody>
      <div class="lg:w-2/3 grid grid-cols-12 gap-5">
        <div class="col-span-12 lg:col-span-4">
          <CardActivity
            title="ការលក់សរុប"
            content="$2134.99"
            :percentage="5.01"
          >
            <div class="p-2 rounded-full bg-yellow-500/20">
              <IconRi:shopping-basket-line class="text-xl text-yellow-600" />
            </div>
          </CardActivity>
        </div>
        <div class="col-span-12 lg:col-span-4">
          <CardActivity title="អតិថិជនសរុប" content="20" :percentage="1.99">
            <div class="p-2 rounded-full bg-indigo-500/20">
              <IconLucide:users class="text-xl text-indigo-600" />
            </div>
          </CardActivity>
        </div>
        <div class="col-span-12 lg:col-span-4">
          <CardActivity title="ការបញ្ជាទិញសរុប" content="40" :percentage="2.99">
            <div class="p-2 rounded-full bg-pink-500/20">
              <IconRi:shopping-basket-line class="text-xl text-pink-600" />
            </div>
          </CardActivity>
        </div>
      </div>
    </PageBody>
  </PageWrapper>
</template>
