<script lang="ts" setup>
/* imports */
import moment from 'moment'
import { IProduct } from '~/types/IProduct'
/* props */
const props = defineProps<{
  invoiceNo: string
  createdAt: string
  buyerName: string
  buyerPhone: string
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    products: any
  }>
}>()

/* states */
const { $humanPrice, $storageFile } = useNuxtApp()

const totalPrice: any = computed(() =>
  props.orderItems.map((item: any) => item.price).reduce((a, b) => a + b)
)
</script>

<template>
  <!--  w-[21cm] min-h-[29.7cm]-->
  <div
    id="invoice"
    class="invoice-container w-[21cm] min-h-[29.7cm] relative bg-white p-10"
  >
    <!-- Invoice Head -->
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center">
        <img
          class="w-20 aspect-square rounded-full"
          src="/assets/logo.webp"
          alt="SR Jewelry"
        />
        <h2 class="title ml-4 text-3xl font-semibold">
          SR Jewelry <br />
          ជាងស្រស់ គីមរ៉ុង
        </h2>
      </div>

      <div class="text-right">
        <h3 class="text-base font-medium text-black">{{ invoiceNo }}</h3>
        <p class="text-base text-gray-700">
          {{ moment(createdAt).format('DD-MMM-YYYY') }}
        </p>
      </div>
    </div>

    <!-- Invoice send receive -->
    <div class="w-full grid grid-cols-2 mt-16">
      <div class="col-span-2 w-full h-[1px] bg-gray-300"></div>
      <div class="w-full mt-2.5">
        <span class="text-base text-gray-500">អ្នកទិញ/Buyer:</span>
        <div class="w-3/4 h-[1px] bg-gray-300 mt-1"></div>
        <ul class="pt-2 space-y-1">
          <li class="flex items-center gap-2">
            <IconRi:user-3-line class="flex-none text-gray-600" />
            <h2 class="text-lg font-medium text-gray-800">
              {{ buyerName }}
            </h2>
          </li>
          <li v-if="buyerPhone" class="flex items-center gap-2">
            <IconIc:baseline-phone class="text-gray-600" />
            <div class="w-full text-base text-gray-600">{{ buyerPhone }}</div>
          </li>
        </ul>
      </div>
      <div class="w-full mt-2.5">
        <span class="text-base text-gray-500">អ្នកលក់/Seller:</span>
        <div class="w-3/4 h-[1px] bg-gray-300 mt-1"></div>
        <ul class="pt-2 space-y-1">
          <li class="flex items-center gap-2">
            <IconFluent:building-retail-more-24-filled class="text-gray-600" />
            <h2 class="text-lg font-medium text-gray-800">Sr Jewelry</h2>
          </li>
          <li class="flex items-center gap-2">
            <IconIc:baseline-phone
              class="flex-none self-start mt-1 text-gray-600"
            />
            <h2 class="text-base text-gray-600">
              096 477 5971/069 605 960/077 869 656
            </h2>
          </li>
          <li class="flex items-center gap-2">
            <IconIc:round-location-on
              class="flex-none self-start mt-1 text-gray-600"
            />
            <div class="w-full text-base text-gray-600">
              តូបលេខ419 ក្នុងផ្សារទួលទំពូង
              <!--              ផ្ទះលេខ #000 ផ្លូវ 35TB ភុូមិសន្សំកុសល២ សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ-->
              <!--              រាជធានីភ្នំពេញ-->
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Invoice Table of Products -->
    <div class="relative overflow-x-auto mt-20">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">ផលិតផល</th>
            <th scope="col" class="px-6 py-3">ចំនួន</th>
            <th scope="col" class="px-6 py-3">តម្លៃរាយ</th>
            <th scope="col" class="px-6 py-3">តម្លៃសរុប</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, idx) in orderItems"
            :key="idx"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <th
              scope="row"
              class="inline-flex items-center gap-3 px-6 py-4 text-base font-medium text-gray-900 whitespace-nowrap"
            >
              <img
                class="w-20 aspect-square rounded-xl shadow-md border"
                :src="
                  $storageFile(
                    item.products.product_images[0].image_path
                      ? 'products/' + item.products.product_images[0].image_path
                      : ''
                  )
                "
                alt=""
              />
              {{ item.products.name }}
            </th>
            <td class="px-6 py-4 text-gray-700">{{ item.quantity }}</td>
            <td class="px-6 py-4 text-gray-700">
              {{ $humanPrice(item.products.price) }}
            </td>
            <td class="px-6 py-4 text-gray-700">
              {{ $humanPrice(item.price) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="float-right my-7 pb-5">
        <p class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-700">សរុប:</span>
          <span class="ml-auto text-lg font-semibold text-black">
            {{ $humanPrice(totalPrice) }}
          </span>
        </p>
      </div>
    </div>
    <div class="absolute bottom-3 left-0 w-full text-center">
      <p>សូមអរគុណចំពោះការគាំទ្រលោកអ្នកមកកាន់ហាងយើងខ្ញុំ</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  print-color-adjust: exact;
}
</style>
