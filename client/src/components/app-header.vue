<template>
  <nav class="w-full h-14 flex items-center justify-between text-sm bg-white sticky top-0 z-50">
    <button
      @click.prevent="
        () => {
          isShow = !isShow
          if (isShow) this.toggleButtonIcon = 'fa-xmark'
          else this.toggleButtonIcon = 'fa-bars'
        }
      "
      class="ml-4 w-5"
    >
      <transition mode="out-in" enter-active-class="animate__rotateIn">
        <i v-if="isShow" class="fa-solid fa-xmark text-xl"></i>
        <i v-else class="fa-solid fa-bars text-xl"></i>
      </transition>
    </button>
    <router-link class="text-base" :to="{ name: 'home' }" @click="hideNavBar">Quiz App</router-link>
    <transition
      enter-active-class="animate__slideInLeft"
      leave-active-class="animate__slideOutLeft"
    >
      <div
        v-show="isShow"
        class="w-full absolute top-14 bg-white z-50"
        style="min-height: calc(100vh - 56px)"
      >
        <ul class="flex flex-col items-center">
          <li
            v-for="(menuItem, index) in menuList.general"
            :key="index"
            class="w-3/4 pb-2 flex flex-col justify-start items-center"
          >
            <router-link
              v-if="menuItem.subMenu.length == 0"
              class="w-full h-full pt-2 flex items-center hover:text-green-600 transition-all"
              :to="{ name: menuItem.routeName }"
              @click="hideNavBar"
              >{{ menuItem.menu }}</router-link
            >
            <button
              v-else
              class="w-full h-full pt-2 basis-12 shrink-0 flex items-center hover:text-green-600 transition-all"
              @click="expand_menu"
              aria-expanded="false"
            >
              <span class="mr-auto">{{ menuItem.menu }}</span>
              <i class="fa-solid fa-plus text-gray-400 text-xs"></i>
            </button>
            <div class="w-full flex flex-col">
              <router-link
                v-for="(subMenu, subIndex) in menuItem.subMenu"
                :key="subIndex"
                class="w-full basis-10 ml-2 flex items-center hover:text-green-600 transition-all"
                style="font-size: 13px"
                :to="{ name: subMenu.routeName }"
                @click="hideNavBar"
                >{{ subMenu.menu }}</router-link
              >
            </div>
          </li>
          <template v-if="userLoggedIn">
            <li
              v-for="(menuItem, index) in menuList.auth.user"
              :key="index"
              class="w-3/4 pb-2 flex flex-col justify-start items-center"
            >
              <router-link
                v-if="menuItem.subMenu.length == 0"
                class="w-full h-full pt-2 flex items-center hover:text-green-600 transition-all"
                :to="{ name: menuItem.routeName }"
                @click="hideNavBar"
                >{{ menuItem.menu }}</router-link
              >
              <template v-else>
                <button
                  class="w-full h-full pt-2 basis-12 shrink-0 flex items-center hover:text-green-600 transition-all"
                  @click="expand_menu"
                  aria-expanded="false"
                >
                  <span class="mr-auto">{{ menuItem.menu }}</span>
                  <i class="fa-solid fa-plus text-gray-400 text-xs"></i>
                </button>
                <div class="w-full flex flex-col">
                  <router-link
                    v-for="(subMenu, subIndex) in menuItem.subMenu"
                    :key="subIndex"
                    class="w-full basis-10 ml-2 flex items-center hover:text-green-600 transition-all"
                    style="font-size: 13px"
                    :to="{ name: subMenu.routeName }"
                    @click="hideNavBar"
                    >{{ subMenu.menu }}</router-link
                  >
                </div>
              </template>
            </li>
          </template>
          <template v-if="userLoggedIn && roles.includes(5150)">
            <li
              v-for="(menuItem, index) in menuList.auth.admin"
              :key="index"
              class="w-3/4 pb-2 flex flex-col justify-start items-center"
            >
              <router-link
                v-if="menuItem.subMenu.length == 0"
                class="w-full h-full pt-2 flex items-center hover:text-green-600 transition-all"
                :to="{ name: menuItem.routeName }"
                @click="hideNavBar"
                >{{ menuItem.menu }}</router-link
              >
              <template v-else>
                <button
                  class="w-full h-full pt-2 basis-12 shrink-0 flex items-center hover:text-green-600 transition-all"
                  @click="expand_menu"
                  aria-expanded="false"
                >
                  <span class="mr-auto">{{ menuItem.menu }}</span>
                  <i class="fa-solid fa-plus text-gray-400 text-xs"></i>
                </button>
                <div class="w-full flex flex-col">
                  <router-link
                    v-for="(subMenu, subIndex) in menuItem.subMenu"
                    :key="subIndex"
                    class="w-full basis-10 ml-2 flex items-center hover:text-green-600 transition-all"
                    style="font-size: 13px"
                    :to="{ name: subMenu.routeName }"
                    @click="hideNavBar"
                    >{{ subMenu.menu }}</router-link
                  >
                </div>
              </template>
            </li>
          </template>
          <li class="w-3/4 pb-2 flex flex-col justify-start items-center">
            <router-link
              v-if="!userLoggedIn"
              class="w-full h-full pt-2 flex items-center hover:text-green-600 transition-all"
              :to="{ name: 'auth' }"
              @click="hideNavBar"
            >
              Login
            </router-link>
            <button
              v-else
              class="w-full h-full pt-2 flex items-center hover:text-green-600 transition-all"
              @click.prevent="logout"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    </transition>
    <router-link v-if="userLoggedIn" :to="{ name: 'account' }" class="mr-4" @click="hideNavBar">
      <img :src="profile_picture" class="h-8 w-6" />
    </router-link>
    <div v-else class="w-6 h-8 mr-4"></div>
  </nav>
</template>

<script>
import { mapWritableState } from 'pinia'
import useAuthStore from '@/stores/auth'
import useConfigStore from '@/stores/config'
import axios from 'axios'

export default {
  name: 'app-header',
  data() {
    return {
      isShow: false,
      toggleButtonIcon: 'fa-bars',
      menuList: {
        general: [
          {
            menu: 'Home',
            routeName: 'home',
            subMenu: []
          }
        ],
        auth: {
          user: [
            {
              menu: 'Quiz',
              routeName: 'quiz',
              subMenu: []
            }
          ],
          admin: [
            {
              menu: 'Admin',
              routeName: '',
              subMenu: [
                {
                  menu: 'Dashboard',
                  routeName: 'admin_dashboard'
                },
                {
                  menu: 'User',
                  routeName: 'admin_user'
                },
                {
                  menu: 'Category',
                  routeName: 'admin_category'
                },
                {
                  menu: 'Quiz',
                  routeName: 'admin_quiz'
                }
              ]
            }
          ]
        }
      }
    }
  },
  props: {
    profile_picture: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapWritableState(useAuthStore, ['userLoggedIn', 'uid', 'roles'])
  },
  methods: {
    hideNavBar() {
      this.isShow = false
      this.toggleButtonIcon = 'fa-bars'
    },
    async logout() {
      try {
        const response = await axios.post('/auth/logout')
        if (response.status === 204) {
          this.hideNavBar()
          this.userLoggedIn = false
          this.uid = ''
          this.roles = []
          localStorage.clear()
          axios.defaults.headers.common['Authorization'] = ''
          this.$router.push({ name: 'home', replace: true })
        }
      } catch (err) {
        console.log(err)
      }
    },
    expand_menu(e) {
      let btn
      e.target.getAttribute('aria-expanded') === null
        ? (btn = e.target.parentElement)
        : (btn = e.target)
      const parent = btn.parentElement
      const icon = btn.children[1]
      if (btn.getAttribute('aria-expanded') === 'false') {
        btn.setAttribute('aria-expanded', 'true')
        btn.classList.add('text-green-600')
        parent.classList.add('open')
        icon.classList.remove('fa-plus')
        icon.classList.add('fa-xmark')
      } else {
        btn.setAttribute('aria-expanded', 'false')
        btn.classList.remove('text-green-600')
        parent.classList.remove('open')
        icon.classList.remove('fa-xmark')
        icon.classList.add('fa-plus')
      }
    }
  }
}
</script>

<style>
nav,
li {
  border-bottom: 1px solid #e5e7eb;
}
li {
  height: 48px;
  overflow: hidden;
}
.open {
  height: auto;
}
.animate__slideInLeft,
.animate__slideOutLeft,
.animate__rotateIn {
  animation-duration: 0.5s;
}
</style>
