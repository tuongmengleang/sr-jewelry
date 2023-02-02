export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  // const client = useSupabaseAuthClient()
  //
  // client.auth.onAuthStateChange((event, session) => {
  //   console.log(event, session)
  // })

  if (!user.value) return navigateTo('/')
})
