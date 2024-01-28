<template>
  <div
    class="h-fit overflow-hidden flex flex-col z-10 bg-white w-full mx-4 my-20 rounded text-sm border border-gray-500"
  >
    <div class="h-9 flex justify-between items-center p-2 bg-gray-100 border-b border-gray-500">
      <h2>{{ formTitle }}</h2>
      <button
        class="w-7 h-7 bg-rose-500 text-white text-xs rounded"
        @click.prevent="this.$emit('closeForm')"
      >
        <i class="fa-solid fa-x"></i>
      </button>
    </div>
    <div class="p-4 grow">
      <vee-form class="relative" @submit="submit">
        <AlertBox
          class="mb-4"
          :show="alert.show"
          :intent="alert.intent"
          :title="alert.title"
          :onDismiss="
            () => {
              alert.show = !alert.show
            }
          "
        >
          <p>{{ alert.message }}</p>
        </AlertBox>
        <div class="flex flex-col mb-4">
          <label>Title</label>
          <vee-field
            type="text"
            class="h-9 p-2 border border-gray-500 rounded"
            name="title"
            rules="required"
            v-model="title"
          />
          <ErrorMessage class="text-red-500" name="title" />
        </div>
        <div class="flex flex-col mb-4">
          <label>Cateogory</label>
          <vee-field
            as="select"
            id="sltCategory"
            class="h-9 p-2 border border-gray-500 rounded bg-white"
            name="category"
            rules="required"
            v-model="category_id"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </vee-field>
          <ErrorMessage class="text-red-500" name="category" />
        </div>
        <div class="flex flex-col mb-4" v-for="(question, quesIndex) in questions" :key="quesIndex">
          <div class="flex justify-between mb-4">
            <label class="">Question {{ quesIndex + 1 }}</label>
            <button
              @click.prevent="
                () => {
                  if (questions.length > 1) questions.splice(quesIndex, 1)
                }
              "
            >
              <i class="fa-regular fa-trash-can text-gray-600 text-xl"></i>
            </button>
          </div>
          <div class="mb-4">
            <div class="flex justify-between gap-2">
              <vee-field
                type="text"
                class="grow h-9 p-2 border border-gray-500 rounded"
                :name="`question${quesIndex + 1}`"
                rules="required"
                v-model="question.q"
              />
              <select
                class="h-9 p-2 border border-gray-500 rounded bg-white"
                v-model="question.type"
                @change="
                  () => {
                    question.answers.forEach((element) => (element.is_correct = false))
                  }
                "
              >
                <option value="choice">Choice</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <ErrorMessage class="text-red-500" :name="`question${quesIndex + 1}`" />
          </div>
          <div
            class="w-full flex items-center justify-between gap-4 mb-2"
            v-for="(answer, ansIndex) in question.answers"
          >
            <input
              v-if="question.type === 'multiple'"
              type="checkbox"
              class="w-5 h-5 rounded"
              value="true"
              v-model="answer.is_correct"
            />
            <input
              v-else
              type="radio"
              class="w-5 h-5 rounded"
              :value="true"
              :name="`ansQ${quesIndex}`"
              v-model="answer.is_correct"
              @click="
                () => {
                  question.answers.forEach((element) => {
                    element === answer ? (element.is_correct = true) : (element.is_correct = false)
                  })
                }
              "
            />
            <div class="grow flex flex-col">
              <vee-field
                type="text"
                class="h-9 p-2 border-b border-gray-500 focus:outline-none focus:border-b-2 focus:border-b-indigo-600"
                :name="`ans${ansIndex + 1}Ques${quesIndex + 1}`"
                rules="required"
                v-model="answer.text"
              />
              <ErrorMessage class="text-red-500" :name="`ans${ansIndex + 1}Ques${quesIndex + 1}`" />
            </div>
          </div>
        </div>
        <div class="flex justify-end mb-4">
          <button
            class="w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-500"
            @click.prevent="
              () => {
                questions.push({
                  q: '',
                  type: 'choice',
                  answers: [
                    {
                      text: '',
                      is_correct: false
                    },
                    {
                      text: '',
                      is_correct: false
                    },
                    {
                      text: '',
                      is_correct: false
                    },
                    {
                      text: '',
                      is_correct: false
                    }
                  ]
                })
              }
            "
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <div class="flex justify-center">
          <button class="w-28 h-9 rounded bg-indigo-600 text-white hover:bg-indigo-500">
            Submit
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useConfigStore from '@/stores/config'
import AlertBox from '@/components/alert-box.vue'

export default {
  name: 'modify-quiz',
  data() {
    return {
      alert: {
        show: false,
        intent: 'info',
        title: '',
        message: ''
      },
      title: '',
      category_id: '',
      categories: [],
      questions: [
        {
          q: '',
          type: 'choice',
          answers: [
            {
              text: '',
              is_correct: false
            },
            {
              text: '',
              is_correct: false
            },
            {
              text: '',
              is_correct: false
            },
            {
              text: '',
              is_correct: false
            }
          ]
        }
      ]
    }
  },
  props: {
    formTitle: {
      type: String,
      required: true
    },
    operation: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapWritableState(useConfigStore, ['serverURL'])
  },
  emits: ['closeForm', 'submitSuccess'],
  methods: {
    async submit() {
      try {
        let response
        if (this.operation === 'add') {
          response = await axios.post('/admin/quiz', {
            title: this.title,
            quiz: this.questions,
            category_id: this.category_id
          })
        } else if (this.operation === 'edit') {
          response = await axios.put('/admin/quiz', {
            id: this.id,
            title: this.title,
            quiz: this.questions,
            category_id: this.category_id
          })
        }

        if (response.data.status === 'success') {
          this.alert.show = true
          this.alert.intent = 'success'
          this.alert.title = 'Category'
          this.alert.message = response.data.message
          setTimeout(() => {
            this.$emit('submitSuccess')
          }, 5000)
        }
      } catch (err) {
        this.alert.show = true
        this.alert.intent = 'danger'
        this.alert.title = 'Quiz'
        this.alert.message = err.message
      }
    }
  },
  async created() {
    try {
      const response = await axios.get('/admin/category', {
        params: {
          onlySub: true
        }
      })
      if (response.data.status === 'success') {
        this.categories = response.data.categories
      }

      if (this.operation === 'edit') {
        const response = await axios.get(`/admin/quiz/${this.id}`)
        if (response.data.status === 'success') {
          this.title = response.data.quiz.title
          this.questions = response.data.quiz.quiz
          this.category_id = response.data.quiz.category_id
        }
      }
    } catch (err) {
      this.alert.show = true
      this.alert.intent = 'danger'
      this.alert.title = 'Quiz'
      this.alert.message = err.message
    }
  },
  components: { AlertBox }
}
</script>
