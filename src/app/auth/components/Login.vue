<template>
    <section class="section">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <div class="box">
                    <h2 class="title is-3 has-text-weight-light">
                    Login
                    </h2>

                    <article class="message is-danger" v-if="errors.root">
                        <div class="message-body">
                            {{ errors.root }}
                        </div>
                    </article>

                    <form @submit.prevent="submit">
                        <div class="field">
                            <label class="label" for="email">Email</label>
                            <div class="control">
                                <input class="input" type="email" id="email" autofocus v-model="email" :class="{ 'is-danger': errors.email }">
                                <p class="help is-danger" v-if="errors.email">
                                    {{ errors.email[0] }}
                                </p>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="password">Password</label>
                            <div class="control">
                                <input class="input" type="password" id="password" v-model="password" :class="{ 'is-danger': errors.password }">
                                <p class="help is-danger" v-if="errors.password">
                                    {{ errors.password[0] }}
                                </p>
                            </div>
                        </div>

                        <div class="field">
                            <div class="control">
                                <button class="button is-link">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions } from 'vuex'
import localforage from 'localforage'
import { isEmpty } from 'lodash'

export default {
  data () {
    return {
      email: null,
      password: null,
      errors: []
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login'
    }),
    async submit () {
      let response = await this.login({
        payload: {
          email: this.email,
          password: this.password
        },
        context: this
      })

      if (response.status === 200) {
        let name = await localforage.getItem('intended')
        localforage.removeItem('intended')
        if (isEmpty(name)) {
          this.$router.replace({ name: 'home' })
          return
        }

        this.$router.replace({ name })
      }
    }
  }
}
</script>
