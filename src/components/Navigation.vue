<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link :to="{ name: 'home' }" class="navbar-item is-size-5">Home</router-link>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start"></div>

            <div class="navbar-end">
            <template v-if="!authenticated">
                <router-link class="navbar-item" :to="{ name: 'login' }">Login</router-link>

                <router-link class="navbar-item" :to="{ name: 'register' }">Register</router-link>

            </template>

            <template v-else>
                <router-link class="navbar-item" :to="{ name: 'badgeLanguages' }">Badge Languages</router-link>

                <div class="navbar-item has-dropdown is-hoverable">
                    <a v-if="user !== null" class="navbar-link">
                    {{ user.name }}
                    </a>

                    <div class="navbar-dropdown is-right">
                    <a class="navbar-item" @click.prevent="signout">
                        Logout
                    </a>
                    </div>
                </div>
            </template>

            </div>
        </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user',
      authenticated: 'auth/authenticated'
    })
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    signout () {
      this.logout().then(() => {
        this.$router.replace({ name: 'home' })
      })
    }
  }
}
</script>
