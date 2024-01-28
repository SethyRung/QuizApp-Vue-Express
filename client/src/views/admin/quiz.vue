<template>
  <div class="w-full px-4 py-8">
    <table class="w-full h-fit text-xs border border-gray-500 overflow-hidden">
      <tr class="h-9 p-2 bg-gray-100 border-b border-gray-500 flex justify-between items-center">
        <h2 class="text-sm">Quizzes</h2>
        <button
          @click.prevent="openForm($event)"
          class="w-7 h-7 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded"
          operation="add"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </tr>
      <tr class="block p-2">
        <table
          class="w-full h-fit text-xs border-l border-r border-t border-gray-500 overflow-hidden"
        >
          <tr class="w-full h-9 bg-gray-100 border-b border-gray-500 flex">
            <th class="pl-2 grow border-gray-500 flex items-center">Title</th>
            <th class="w-32 pl-2 border-x border-gray-500 flex items-center">Category</th>
            <th class="w-28 pl-2 border-gray-500 flex items-center">Operation</th>
          </tr>
          <tr
            class="w-full h-8 overflow-hidden flex border-b border-gray-500 transition-all"
            v-for="quiz in quizzes"
            :key="quiz.id"
          >
            <td class="grow pl-2">
              <p class="break-all h-8 leading-8 overflow-hidden">{{ quiz.title }}</p>
            </td>
            <td class="w-32 pl-2 border-x border-gray-500 pb-1">
              <p class="break-all h-8 leading-8 overflow-hidden">{{ quiz.category }}</p>
            </td>
            <td class="w-28 shrink-0 flex justify-center items-center gap-2 py-2">
              <button
                class="w-10 h-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                operation="edit"
                @click.prevent="openForm($event)"
              >
                Edit
              </button>
              <button
                class="w-12 h-6 bg-rose-500 hover:bg-rose-400 text-white rounded"
                operation="delete"
                @click.prevent="openForm($event)"
              >
                Delete
              </button>
            </td>
            <td class="hidden">{{ quiz.id }}</td>
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
        <ModifyQuiz
          v-if="isDeleteOperation === false"
          :formTitle="formTitle"
          :id="id"
          :operation="operation"
          @closeForm="loadData"
          @submitSuccess="loadData"
        />
        <AlertBox
          class="h-fit w-full mx-4 my-20 z-10 bg-white"
          :show="isDeleteOperation"
          :intent="alert.intent"
          title="Delete"
          :onDismiss="
            () => {
              isDeleteOperation = false
              isOpen = false
            }
          "
        >
          <p>{{ alert.message }}</p>
          <div class="mt-8 flex justify-center gap-4">
            <button
              v-if="alert.error === false"
              class="w-14 h-7 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
              @click.prevent="deleteQuiz"
            >
              Yes
            </button>
            <button
              @click.prevent="
                () => {
                  isDeleteOperation = false
                  isOpen = false
                }
              "
              class="w-14 h-7 rounded border border-gray-500 text-black hover:text-white hover:bg-gray-500"
            >
              <span v-if="alert.error === false"> No </span>
              <span v-else> OK </span>
            </button>
          </div>
        </AlertBox>
      </div>
    </transition>
  </div>
</template>
<script>
import ModifyQuiz from '@/components/form/modify-quiz.vue'
import AlertBox from '@/components/alert-box.vue'
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useConfigStore from '@/stores/config'

export default {
  name: 'quiz',
  data() {
    return {
      quizzes: {},
      isOpen: false,
      isDeleteOperation: false,
      alert: {
        intent: 'warning',
        error: false,
        message: 'Are you sure you want to delete this quiz?'
      },
      formTitle: '',
      id: 0,
      operation: ''
    }
  },
  components: { ModifyQuiz, AlertBox },
  methods: {
    openForm($event) {
      let btn
      $event.target.tagName !== 'BUTTON'
        ? (btn = $event.target.parentElement)
        : (btn = $event.target)

      this.operation = btn.getAttribute('operation')

      if (this.operation === 'add') {
        this.formTitle = 'Add Quiz'
      } else {
        const tr = btn.parentElement.parentElement
        this.id = parseInt(tr.children[3].textContent)
        const title = tr.children[0].children[0].textContent
        if (this.operation === 'edit') {
          this.formTitle = `Edit ${title}`
        } else if (this.operation === 'delete') {
          this.formTitle = `Delete ${title}`
          this.isDeleteOperation = true
        }
      }
      this.isOpen = true
    },
    async loadData() {
      try {
        const response = await axios.get(`/admin/quiz`)
        if (response.data.status === 'success') {
          this.quizzes = response.data.quizzes
          this.isOpen = false
        }
      } catch (err) {
        console.log(err.message)
      }
    },
    async deleteQuiz() {
      try {
        const response = await axios.delete('/admin/quiz', {
          data: {
            id: this.id
          }
        })

        if (response.data.status === 'success') {
          this.isDeleteOperation = false
          this.isOpen = false
          this.loadData()
        }
      } catch (err) {
        this.alert.intent = 'danger'
        this.alert.error = true
        this.alert.message = err.message
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
