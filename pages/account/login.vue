<script setup lang="ts">
import * as Yup from 'yup'
import { POSITION, useToast } from 'vue-toastification'

/* vars */
const schema = Yup.object().shape({
  email: Yup.string().email().required('សូមបំពេញអីម៉ែល'),
  password: Yup.string().required('សូមបំពេញពាក្យសម្ងាត់'),
})

const router = useRouter()
const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const toast = useToast()

watchEffect(() => {
  if (user.value) router.push('/')
})

const onSubmit = async (values: any, actions: any) => {
  loading.value = true
  const { data, error } = await client.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })
  loading.value = false
  console.log({ data, error })
  if (error) {
    toast.error('សម្គាល់មិនត្រឹមត្រូវ សូមពិនិត្យម្ដងទៀត🥲', {
      position: POSITION.TOP_CENTER,
    })
    actions.resetForm({
      values: {
        email: values.email,
        password: '',
      },
    })
  }
  // else {
  //   router.push({ name: 'index' })
  // }
}
</script>

<template>
  <PageWrapper class="w-full min-h-screen grid place-items-center">
    <PageBody class="px-7 lg:px-0">
      <Form
        id="loginForm"
        :validation-schema="schema"
        class="w-full"
        @submit="onSubmit"
      >
        <img
          class="w-28 h-28 rounded-full mx-auto mb-5"
          src="/assets/logo.webp"
          alt="SR Jewelry"
        />
        <h1 class="text-3xl text-gray-700 text-center font-medium">
          ហាងគ្រឿងអលង្ការ SR
        </h1>
        <div class="flex flex-col gap-y-3 pt-5">
          <FormInput
            name="email"
            type="email"
            label="អីម៉ែល"
            placeholder="example@test.com"
            error-message="អ៊ីមែលត្រូវបានទាមទារ"
          />
          <FormInput
            name="password"
            type="password"
            label="ពាក្យសម្ងាត់"
            placeholder="ពាក្យសម្ងាត់"
          />
          <Button
            size="md"
            type="submit"
            form="loginForm"
            :loading="loading"
            class="w-full mt-5"
          >
            ចូល
          </Button>
        </div>
      </Form>
    </PageBody>
  </PageWrapper>
</template>

<style scoped></style>
