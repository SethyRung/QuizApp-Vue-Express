<template>
  <div class="flex flex-col">
    <div
      class="w-full h-60 font-roboto py-7"
      style="background: linear-gradient(180deg, #fff 0%, #e9fdfc 0.01%, #fff 100%)"
    >
      <h1 class="w-64 text-center mx-auto text-2xl font-bold mb-4">
        Daily Quiz, Daily Bonus- Play Today!
      </h1>
      <p class="w-64 text-center mx-auto text-sm">
        Quiz is the daily Trivia and quiz playing platform. It brings some exciting surprises every
        day.
      </p>
      <router-link
        class="h-8 w-28 mx-auto mt-6 flex items-center justify-center gap-2 bg-yellow-400 rounded text-sm text-white"
        :to="{ name: 'quiz' }"
        ><i class="fa-solid fa-circle-play"></i> Play Now</router-link
      >
    </div>
    <div>
      <img src="@/assets/images/94767-OK1W3B-473.jpg" alt="" class="w-64 mx-auto" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'home',

  data() {
    return {
      showAlert: true
    }
  }
}
</script>
