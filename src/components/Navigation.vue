<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <!-- <router-link :to="{ name: 'home' }" class="navbar-item is-size-5">Home</router-link> -->

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start" >
            </div>

            <div class="navbar-end">
              <b-dropdown
                position="is-bottom-left"
                aria-role="menu">
                <a
                  class="navbar-item"
                  slot="trigger"
                  role="button">
                  <span>Menu</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>
                  <template v-if="authenticated">
                    <b-dropdown-item aria-role="menuitem">
                      <p v-if="user !== null">
                        Logged in: {{ user.name }}
                      </p>
                    </b-dropdown-item>
                  </template>

                <template v-if="!authenticated">
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'login' }">Login</router-link>
                  </b-dropdown-item>
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'register' }">Register</router-link>
                  </b-dropdown-item>
                </template>
                <hr class="dropdown-divider" aria-role="menuitem">

                <template v-if="authenticated">
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'badgeLanguages' }">Badge Languages</router-link>
                  </b-dropdown-item>
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'courseLanguages' }">Course Languages</router-link>
                  </b-dropdown-item>
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'multilingualCourses' }">Course Groups</router-link>
                  </b-dropdown-item>
                  <b-dropdown-item has-link aria-role="menuitem">
                    <router-link class="navbar-item" :to="{ name: 'reports' }">Generate Report</router-link>
                  </b-dropdown-item>
                </template>

                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'catalogs' }" >Generate Catalog</router-link>
                </b-dropdown-item>
                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'courseMetadata' }" >Generate Course Metadata</router-link>
                </b-dropdown-item>
                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'charts' }" >Charts</router-link>
                </b-dropdown-item>
                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'webinarAttendance' }" >Webinar Attendance</router-link>
                </b-dropdown-item>
                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'catalogBlacklist' }" >Catalog Blacklist</router-link>
                </b-dropdown-item>
                <b-dropdown-item has-link aria-role="menuitem">
                  <router-link class="navbar-item" :to="{ name: 'cometUpload' }" >COMET Upload</router-link>
                </b-dropdown-item>

                <template v-if="authenticated">
                  <hr class="dropdown-divider" aria-role="menuitem">
                  <b-dropdown-item has-link aria-role="menuitem">
                    <a class="navbar-item" @click.prevent="signout">
                      Logout
                    </a>
                  </b-dropdown-item>
                </template>
              </b-dropdown>
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
