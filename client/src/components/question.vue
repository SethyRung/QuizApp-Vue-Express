<template>
  <form
    v-if="this.questions.length > 0"
    class="mx-4 flex flex-col text-base"
    style="min-height: calc(100vh - 128px)"
    @submit.prevent="submit"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-lg">{{ quizTitle }}</h3>
      <h4 v-if="submitted">
        Total points
        <span class="inline-block bg-indigo-600 text-white h-7 w-10 text-center rounded-md ml-2">
          {{ totalPoints + '/' + questions.length }}
        </span>
      </h4>
    </div>
    <div v-for="(question, question_index) in questions" :key="question.q" class="mb-8">
      <p>{{ question_index + 1 + '. ' + question.q }}</p>
      <label
        v-for="(answer, answer_index) in question.answers"
        :for="`${question_index}_${answer_index}`"
        class="w-full h-10 mt-4 px-2 border border-gray-500 rounded-lg flex items-center text-sm"
        :class="[
          userAnswers[question_index][answer_index].isSelected ? 'bg-sky-100' : 'bg-white',
          userAnswers[question_index][answer_index].isSelected &&
          userAnswers[question_index][answer_index].is_correct === true
            ? 'border-green-500 border-2'
            : '',
          userAnswers[question_index][answer_index].isSelected === false &&
          userAnswers[question_index][answer_index].is_correct === true
            ? 'border-red-500 border-2'
            : ''
        ]"
      >
        <span
          class="w-7 h-7 mr-2 border border-gray-500 flex items-center justify-center text-xs"
          :class="[
            userAnswers[question_index][answer_index].isSelected ? 'bg-sky-300' : 'bg-white',
            question.type === 'choice' ? 'rounded-full' : 'rounded-lg'
          ]"
        >
          {{ answerCollection[answer_index] }}
        </span>
        {{ answer.text }}
        <i
          class="fa-solid text-lg ml-auto"
          :class="[
            this.userAnswers[question_index][answer_index].is_correct === true
              ? 'fa-circle-check text-green-500'
              : '',
            this.userAnswers[question_index][answer_index].is_correct === false
              ? 'fa-circle-xmark text-red-500'
              : ''
          ]"
        ></i>
        <input
          v-if="question.type === 'multiple'"
          type="checkbox"
          class="hidden"
          :id="`${question_index}_${answer_index}`"
          :disabled="submitted"
          v-model="userAnswers[question_index][answer_index].isSelected"
        />
        <input
          v-else
          type="radio"
          class="hidden"
          :id="`${question_index}_${answer_index}`"
          :name="`ansQ${question_index}`"
          :disabled="submitted"
          v-model="userAnswers[question_index][answer_index].isSelected"
          @click="
            () => {
              userAnswers[question_index].forEach((element) => {
                element === answer ? (element.isSelected = true) : (element.isSelected = false)
              })
            }
          "
        />
      </label>
    </div>
    <button
      type="submit"
      class="h-12 rounded-full mt-auto mb-4 text-sm text-white font-bold bg-indigo-600"
    >
      Submit
    </button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'question',
  props: {
    category_id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      answerCollection: ['A', 'B', 'C', 'D'],
      submitted: false,
      quizTitle: '',
      questions: [],
      userAnswers: [],
      totalPoints: 0
    }
  },
  methods: {
    submit() {
      this.submitted = true
      this.questions.forEach((question, question_index) => {
        let score = 0
        let isCorrectAllAnswer = true
        question.answers.forEach((answer, answer_index) => {
          if (answer.is_correct && this.userAnswers[question_index][answer_index].isSelected) {
            this.userAnswers[question_index][answer_index].is_correct = true
            score = 1
          } else if (
            answer.is_correct &&
            !this.userAnswers[question_index][answer_index].isSelected
          ) {
            this.userAnswers[question_index][answer_index].is_correct = true
            score = 0
            isCorrectAllAnswer = false
          } else if (
            !answer.is_correct &&
            this.userAnswers[question_index][answer_index].isSelected
          ) {
            this.userAnswers[question_index][answer_index].is_correct = false
            score = 0
            isCorrectAllAnswer = false
          }
        })
        if (!isCorrectAllAnswer) score = 0
        this.totalPoints += score
      })
    }
  },
  async created() {
    try {
      const response = await axios.get('/quiz', {
        params: {
          category_id: this.category_id
        }
      })
      if (response.data.status === 'success') {
        this.quizTitle = response.data.quiz.title
        this.questions = response.data.quiz.questions
        this.questions.forEach(() => {
          this.userAnswers.push([
            {
              isSelected: false,
              is_correct: ''
            },
            {
              isSelected: false,
              is_correct: ''
            },
            {
              isSelected: false,
              is_correct: ''
            },
            {
              isSelected: false,
              is_correct: ''
            }
          ])
        })
      }
    } catch (err) {}
  }
}
</script>
