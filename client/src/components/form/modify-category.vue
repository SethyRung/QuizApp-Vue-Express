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
    <div class="p-8 grow">
      <vee-form @submit="submit" class="relative">
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
          <label>Category Name</label>
          <vee-field
            type="text"
            class="h-9 p-2 border border-gray-500 rounded"
            name="category_name"
            rules="required"
            :value="category.name"
          />
          <ErrorMessage class="text-red-500" name="category_name" />
        </div>
        <div class="flex flex-col mb-4">
          <label>Icon</label>
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-500 px-6 py-10 hover:border-solid"
            @dragend.prevent.stop=""
            @dragover.prevent.stop=""
            @drop.prevent.stop="handleUploadImage($event)"
          >
            <div class="text-center">
              <i
                v-if="icon.fullPath === ''"
                class="fa-solid fa-image mx-auto text-6xl text-gray-500"
              ></i>
              <img
                v-else
                :src="icon.fullPath"
                class="mx-auto h-16 w-16 object-cover border-none rounded"
              />
              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  for="icon"
                  class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <vee-field
                    id="icon"
                    name="icon"
                    type="file"
                    class="sr-only"
                    :rules="this.iconRule"
                    @change="handleUploadImage($event)"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs leading-5 text-gray-600">PNG, SVG up to 5MB</p>
            </div>
          </div>
          <ErrorMessage class="text-red-500" name="icon" />
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
  name: 'modify-category',
  data() {
    return {
      icon: { name: this.category.icon.name, fullPath: this.category.icon.fullPath },
      alert: {
        show: false,
        intent: 'info',
        title: '',
        message: ''
      }
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
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapWritableState(useConfigStore, ['serverURL']),
    iconRule() {
      if (this.icon.name === '') return 'required|mimes:image/png,image/svg'
      else return ''
    }
  },
  emits: ['closeForm', 'submitSuccess'],
  methods: {
    async handleUploadImage($event) {
      let files = new DataTransfer().files
      files = $event.dataTransfer ? $event.dataTransfer.files : $event.target.files
      const file = files[0]
      if ($event.dataTransfer) {
        document.querySelector('#icon').files = files
        document.querySelector('#icon').dispatchEvent(new Event('change'))
      }

      try {
        const formData = new FormData()
        formData.append(file.name, file)

        const response = await axios.post('/upload', formData)
        if (response.data.status === 'success') {
          this.icon.name = `${response.data.path}/${response.data.files[0]}`
          this.icon.fullPath = `${this.serverURL}/${response.data.path}/${response.data.files[0]}`
          this.alert.show = true
          this.alert.intent = 'success'
          this.alert.title = 'Upload Icon'
          this.alert.message = response.data.message
        }
      } catch (err) {
        this.icon.name = ''
        this.icon.fullPath = ''
        this.alert.show = true
        this.alert.intent = 'danger'
        this.alert.title = 'Upload Icon'
        this.alert.message = err.message
      }
    },
    async submit(data) {
      data.icon = this.icon.name
      try {
        let response
        if (this.operation === 'addMain') {
          response = await axios.post('/admin/category', {
            icon: this.icon.name,
            name: data.category_name
          })
        } else if (this.operation === 'edit') {
          response = await axios.put('/admin/category', {
            id: this.category.id,
            icon: this.icon.name,
            name: data.category_name
          })
        } else if (this.operation === 'addSub') {
          response = await axios.post('/admin/category', {
            icon: this.icon.name,
            name: data.category_name,
            parent_id: this.category.parent_id
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
        this.alert.title = 'Category'
        this.alert.message = err.message
      }
    }
  },
  components: { AlertBox }
}
</script>
