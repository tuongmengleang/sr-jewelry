import { defineStore } from 'pinia'
import { ICustomer } from '~/types/ICustomer'

interface ICustomerState {
  customer: null | ICustomer
  customers: [] | Array<ICustomer>
}

export const useCustomer = defineStore('customer', {
  state: (): ICustomerState => ({
    customer: <ICustomer>{
      id: '',
      name: '',
      phone: '',
      address: '',
      profile_image: '',
    },
    customers: [
      {
        id: '0f08e76e-3b28-42e3-9bce-2c2361136be4',
        name: 'ហ៊ា ទី',
        phone: '096 123 2123',
        address: 'ស្ទឹងមានជ័យ, ភ្នំពេញ',
        profile_image:
          'https://i.pinimg.com/564x/08/07/92/080792c1d6fc920ad06631df2f127c3f.jpg',
      },
      {
        id: '5a691820-aaf4-4117-bd43-e85385217a10',
        name: 'នី សុចិត្រា',
        phone: '097 890 9021',
        address: 'សែនសុខ, ភ្នំពេញ',
        profile_image:
          'https://i.pinimg.com/564x/d9/9d/05/d99d0594f4d7221de98e19aa3a9c2bb1.jpg',
      },
      {
        id: 'ee4ae54d-b328-4968-bdf7-dbe3c21355c8',
        name: 'Chhormchhay',
        phone: '078 542 099',
        address: 'អូរឡាំពិក, ភ្នំពេញ',
        profile_image:
          'https://i.pinimg.com/564x/c4/fb/42/c4fb425931237d714fce41276c7a759c.jpg',
      },
      {
        id: '991f2546-5a68-4a1d-8c74-9062d222d66a',
        name: 'គ្រូអាយធីចិត្តល្អ',
        phone: '011 212 212',
        address: 'ប្រទះឡាង, ភ្នំពេញ',
        profile_image:
          'https://i.pinimg.com/564x/24/d8/65/24d8656b4cbec737782022f0f1e2b525.jpg',
      },
      {
        id: '8addad20-e332-44fe-b5da-5c75b1f88220',
        name: 'Nut Sereyvuth',
        phone: '098 728 901',
        address: 'សង្កាត់ផ្សារដើមគរ និងសង្កាត់បឹងសាឡាង',
        profile_image:
          'https://images.pexels.com/photos/10748164/pexels-photo-10748164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: '033df929-d592-4204-87ba-193549d5c605',
        name: 'Asda Inc',
        phone: '010 900 800',
        address: 'សង្កាត់វាលវង់ និងសង្កាត់បឹងព្រលឹត',
        profile_image:
          'https://images.pexels.com/photos/14792109/pexels-photo-14792109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: '2e4112f5-0e4f-4fd5-a7f5-b2243424504f',
        name: 'រៀមសុខភិរម្យ',
        phone: '096 661 7771',
        address: 'កៀនស្វាយ',
        profile_image:
          'https://images.pexels.com/photos/14577737/pexels-photo-14577737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: '757c5455-8bc2-432b-a6ea-7d265b7ba11b',
        name: 'Pin Trainer',
        phone: '012 677 123',
        address: 'ផ្សារដេប៉ូ',
        profile_image:
          'https://images.pexels.com/photos/14711370/pexels-photo-14711370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: '4e1a4901-08fd-4124-9fdc-f50ff592946e',
        name: 'Seam Chansophary',
        phone: '097 872 1231',
        address: 'ចាក់អង្រែលើ',
        profile_image:
          'https://images.pexels.com/photos/11178919/pexels-photo-11178919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: 'be25d3df-54c7-4f26-b743-848e8220fd89',
        name: 'Sovann Rithy',
        phone: '096 711 2133',
        address: 'ព្រៃវែង',
        profile_image:
          'https://images.pexels.com/photos/10476583/pexels-photo-10476583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ],
  }),
})
