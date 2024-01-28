<template>
  <transition-group
    tag="div"
    enter-active-class="animate__fadeIn animate__zoomIn"
    leave-active-class="animate__fadeOut animate__zoomOut"
    class="mt-4"
  >
    <div v-for="category in categories" :key="category.id">
      <div class="mx-4 mb-8 flex items-center justify-between">
        <div class="flex">
          <img class="h-6 mr-2" :src="`${serverURL}/${category.icon}`" alt="" />
          <h2 class="font-bold">{{ category.name }}</h2>
        </div>
        <button
          v-if="back_id.length > 0"
          class="text-xl h-6 overflow-hidden"
          @click.prevent="
            () => {
              parent_id = back_id.pop()
            }
          "
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button>
      </div>

      <Question v-if="category.sub.length === 0" :category_id="category.id" />

      <div
        class="mx-4 grid justify-center place-items-center"
        :class="category.sub.length > 1 ? 'gap-8' : ''"
        style="grid-template-columns: repeat(2, minmax(0, auto))"
      >
        <div
          class="w-28 h-32 rounded-lg border border-gray-500 flex flex-col items-center justify-center gap-4 hover:cursor-pointer hover:border-2"
          style="box-shadow: 16px 16px 16px 0px #f0f5fb"
          v-for="subCategory in category.sub"
          :key="subCategory.id"
          @click="
            () => {
              back_id.push(parent_id)
              parent_id = subCategory.id
            }
          "
        >
          <img class="h-12" :src="`${serverURL}/${subCategory.icon}`" alt="" />
          <h3 class="text-base">{{ subCategory.name }}</h3>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import Question from '@/components/question.vue'
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useConfigStore from '@/stores/config'

export default {
  name: 'quiz',
  components: { Question },
  data() {
    return {
      categories: [],
      parent_id: 0,
      back_id: []
    }
  },
  computed: {
    ...mapWritableState(useConfigStore, ['serverURL'])
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get('/category', {
          params: {
            parent_id: this.parent_id
          }
        })
        if (response.data.status === 'success') {
          this.categories = response.data.categories
        }
      } catch (err) {
        console.log(err.message)
      }
    }
  },
  watch: {
    parent_id() {
      this.getCategories()
    }
  },
  async created() {
    this.getCategories()
  }
}
</script>
<style>
.animate__fadeIn,
.animate__fadeOut {
  animation-duration: 0.5s;
  position: absolute;
  width: 100%;
}

.animate__zoomIn,
.animate__zoomOut {
  animation-duration: 0.3s;
  position: absolute;
  width: 100%;
}
</style>
