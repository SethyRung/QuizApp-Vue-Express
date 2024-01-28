<template>
  <transition
    enter-from-class="opacity-0"
    enter-active-class="duration-300"
    leave-to-class="opacity-0"
    leave-active-class="duration-300"
  >
    <div v-if="this.show" :class="containerClass">
      <div class="shrink-0">
        <i :class="iconClass"></i>
      </div>
      <div class="flex-1 space-y-2 min-w-0">
        <h2 v-if="this.title" :class="titleClass">
          {{ this.title }}
        </h2>
        <div :class="contentClass">
          <slot />
        </div>
      </div>
      <div v-if="this.onDismiss" class="shrink-0">
        <button
          :title="dismissLabel"
          :aria-label="dismissLabel"
          :class="closeButtonClass"
          @click.prevent="dismiss()"
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { cva } from 'class-variance-authority'

export default {
  name: 'alert-box',
  props: {
    intent: {
      type: String,
      validator(value) {
        return ['info', 'success', 'danger', 'warning'].includes(value)
      },
      default: 'info'
    },
    title: String,
    show: {
      type: Boolean,
      default: true
    },
    onDismiss: Function,
    dismissLabel: {
      type: String,
      default: 'Dismiss'
    }
  },
  computed: {
    containerClass() {
      return cva('flex p-4 rounded-md space-x-3', {
        variants: {
          intent: {
            info: 'bg-blue-100',
            success: 'bg-green-100',
            warning: 'bg-orange-100',
            danger: 'bg-red-100'
          }
        }
      })({
        intent: this.intent
      })
    },
    iconClass() {
      return cva('text-xl fa-solid', {
        variants: {
          intent: {
            info: 'fa-circle-info text-blue-700',
            success: 'fa-circle-check text-green-600',
            warning: 'fa-triangle-exclamation text-orange-400',
            danger: 'fa-circle-xmark text-red-500'
          }
        }
      })({
        intent: this.intent
      })
    },
    titleClass() {
      return cva('font-medium', {
        variants: {
          intent: {
            info: 'text-blue-900',
            success: 'text-green-900',
            warning: 'text-orange-900',
            danger: 'text-red-900'
          }
        }
      })({
        intent: this.intent
      })
    },
    contentClass() {
      return cva('text-sm', {
        variants: {
          intent: {
            info: 'text-blue-800',
            success: 'text-green-800',
            warning: 'text-orange-800',
            danger: 'text-red-800'
          }
        }
      })({
        intent: this.intent
      })
    },
    closeButtonClass() {
      return cva('px-2 py-1 rounded-md -m-1', {
        variants: {
          intent: {
            info: 'text-blue-900/70 hover:text-blue-900 hover:bg-blue-200 active:bg-blue-300',
            success:
              'text-green-900/70 hover:text-green-900 hover:bg-green-200 active:bg-green-300',
            warning:
              'text-orange-900/70 hover:text-orange-900 hover:bg-orange-200 active:bg-orange-300',
            danger: 'text-red-900/70 hover:text-red-900 hover:bg-red-200 active:bg-red-300'
          }
        }
      })({
        intent: this.intent
      })
    }
  },
  methods: {
    dismiss() {
      if (this.onDismiss) {
        this.onDismiss()
      }
    }
  }
}
</script>
