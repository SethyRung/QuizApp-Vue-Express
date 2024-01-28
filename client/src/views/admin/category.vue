<template>
  <div class="w-full px-4 py-8">
    <table class="w-full h-fit text-xs border border-gray-500 overflow-hidden">
      <tr class="h-9 p-2 bg-gray-100 border-b border-gray-500 flex justify-between items-center">
        <h2 class="text-sm">Category</h2>
        <button
          @click.prevent="openForm($event)"
          class="w-7 h-7 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded"
          operation="addMain"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </tr>
      <tr class="block p-2">
        <table
          class="w-full h-fit text-xs border-l border-r border-t border-gray-500 overflow-hidden"
        >
          <tr class="w-full h-9 bg-gray-100 border-b border-gray-500 flex">
            <th class="w-8"></th>
            <th class="grow pl-2 border-x border-gray-500 flex items-center">MainCategory</th>
            <th class="w-36 pl-2 border-gray-500 flex items-center">Operation</th>
          </tr>
          <tr
            class="w-full h-8 overflow-hidden flex border-b border-gray-500 transition-all"
            v-for="main in categories.main"
            :key="main.id"
          >
            <td class="w-8 flex justify-center shrink-0 py-1">
              <button
                class="w-6 h-6"
                v-if="main.sub.length > 0"
                @click.prevent="toggleSub"
                show="false"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </td>
            <td class="grow pl-2 border-x border-gray-500 pb-1">
              <div class="flex h-8 gap-2">
                <img :src="`${this.serverURL}/${main.icon}`" alt="Icon" class="w-5" />
                <p class="break-all h-8 leading-8 overflow-hidden">{{ main.name }}</p>
              </div>
              <div class="ml-4 mt-3 flex flex-col gap-1">
                <div class="flex gap-2 h-5" v-for="sub in main.sub" :key="sub.id">
                  <img :src="`${this.serverURL}/${sub.icon}`" alt="Icon" class="w-5" />
                  <p>{{ sub.name }}</p>
                </div>
              </div>
            </td>
            <td class="w-36 shrink-0 flex justify-center items-center gap-2 py-2">
              <button
                class="w-10 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                operation="edit"
                @click.prevent="openForm($event)"
              >
                Edit
              </button>
              <button
                class="w-20 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                operation="addSub"
                @click.prevent="openForm($event)"
              >
                +SubCategory
              </button>
            </td>
            <td class="hidden">{{ main.id }}</td>
          </tr>
        </table>
        <table
          class="w-full h-fit mt-2 text-xs border-l border-r border-t border-gray-500 overflow-hidden"
        >
          <tr class="w-full h-9 bg-gray-100 border-b border-gray-500 flex">
            <th class="w-8"></th>
            <th class="grow pl-2 border-x border-gray-500 flex items-center">SubCategory</th>
            <th class="w-36 pl-2 border-gray-500 flex items-center">Operation</th>
          </tr>
          <tr
            class="w-full h-8 overflow-hidden flex border-b border-gray-500 transition-all"
            v-for="main in categories.sub"
            :key="main.id"
          >
            <td class="w-8 flex justify-center shrink-0 py-1">
              <button
                class="w-6 h-6"
                v-if="main.sub.length > 0"
                @click.prevent="toggleSub"
                show="false"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </td>
            <td class="grow pl-2 border-x border-gray-500 pb-1">
              <div class="flex h-8 gap-2">
                <img :src="`${this.serverURL}/${main.icon}`" alt="Icon" class="w-5" />
                <p class="break-all h-8 leading-8 overflow-hidden">{{ main.name }}</p>
              </div>
              <div class="ml-4 mt-3 flex flex-col gap-1">
                <div class="flex gap-2 h-5" v-for="sub in main.sub" :key="sub.id">
                  <img :src="`${this.serverURL}/${sub.icon}`" alt="Icon" class="w-5" />
                  <p>{{ sub.name }}</p>
                </div>
              </div>
            </td>
            <td class="w-36 shrink-0 flex justify-center items-center gap-2 py-2">
              <button
                class="w-10 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                operation="edit"
                @click.prevent="openForm($event)"
              >
                Edit
              </button>
              <button
                class="w-20 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                operation="addSub"
                @click.prevent="openForm($event)"
              >
                +SubCategory
              </button>
            </td>
            <td class="hidden">{{ main.id }}</td>
          </tr>
        </table>
      </tr>
    </table>
    <transition
      enter-from-class="opacity-0"
      enter-active-class="duration-200"
      leave-to-class="opacity-0"
      leave-active-class="duration-200"
    >
      <div
        class="w-screen min-h-full z-10 fixed inset-0 flex justify-center overflow-scroll"
        v-if="isOpen"
      >
        <div class="fixed inset-0 bg-gray-500 opacity-75"></div>
        <ModifyCategory
          :formTitle="formTitle"
          :category="category"
          :operation="operation"
          @closeForm="loadData"
          @submitSuccess="loadData"
        />
      </div>
    </transition>
  </div>
</template>
<script>
import ModifyCategory from '@/components/form/modify-category.vue'
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useConfigStore from '@/stores/config'

export default {
  name: 'category',
  data() {
    return {
      categories: { main: [], sub: [] },
      isOpen: false,
      formTitle: '',
      category: {
        id: 0,
        icon: {
          name: '',
          fullPath: ''
        },
        name: '',
        parent_id: 0
      },
      // id: 0,
      // parent_id: 0,
      operation: ''
    }
  },
  components: { ModifyCategory },
  methods: {
    openForm($event) {
      let btn
      $event.target.tagName !== 'BUTTON'
        ? (btn = $event.target.parentElement)
        : (btn = $event.target)

      this.operation = btn.getAttribute('operation')
      this.category = {
        id: 0,
        icon: {
          name: '',
          fullPath: ''
        },
        name: '',
        parent_id: 0
      }
      if (this.operation === 'addMain') {
        this.formTitle = 'Add MainCategory'
      } else {
        const tr = btn.parentElement.parentElement
        this.category.id = parseInt(tr.children[3].textContent)
        this.category.parent_id = isNaN(this.category.id) ? 0 : this.category.id
        const parent_name = tr.children[1].children[0].textContent
        if (this.operation === 'edit') {
          this.formTitle = `Edit ${parent_name}`
          this.category.icon.fullPath = tr.children[1].children[0].children[0].src
          this.category.icon.name =
            this.category.icon.fullPath.split(`${this.serverURL}/`)[1] === undefined
              ? ''
              : this.category.icon.fullPath.split(`${this.serverURL}/`)[1]
          this.category.name = tr.children[1].children[0].textContent
        } else if (this.operation === 'addSub') {
          this.formTitle = `Add SubCategory for ${parent_name}`
        }
      }
      this.isOpen = true
    },
    toggleSub($event) {
      let btn
      $event.target.tagName !== 'BUTTON'
        ? (btn = $event.target.parentElement)
        : (btn = $event.target)
      const tr = btn.parentElement.parentElement
      if (btn.getAttribute('show') === 'false') {
        btn.children[0].classList.remove('fa-plus')
        btn.children[0].classList.add('fa-minus')

        tr.classList.remove('h-8')
        tr.classList.add('h-fit')
        tr.children[2].classList.remove('items-center')
      } else {
        btn.children[0].classList.remove('fa-minus')
        btn.children[0].classList.add('fa-plus')

        tr.classList.remove('h-fit')
        tr.classList.add('h-8')
        tr.children[2].classList.add('items-center')
      }
      btn.setAttribute('show', btn.getAttribute('show') === 'false')
    },
    async loadData() {
      try {
        const response = await axios.get('/admin/category', {
          params: {
            onlySub: false
          }
        })
        if (response.data.status === 'success') {
          this.categories = response.data.categories
          this.isOpen = false
        }
      } catch (err) {
        // console.log(err.response.data.message)
      }
    }
  },
  computed: {
    ...mapWritableState(useConfigStore, ['serverURL']),
    hiddenClass() {
      return this.isOpen ? '' : 'hidden'
    }
  },
  created() {
    this.loadData()
  }
}
</script>
