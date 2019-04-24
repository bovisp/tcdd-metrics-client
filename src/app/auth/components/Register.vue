<template>
    <section class="section">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <div class="box">
                    <h2 class="title is-3 has-text-weight-light">
                    Register
                    </h2>

                    <form @submit.prevent="submit">
                        <div class="field">
                            <label class="label" for="name">Name</label>
                            <div class="control">
                                <input class="input" type="name" id="name" autofocus v-model="name" :class="{ 'is-danger': errors.name }">
                                <p class="help is-danger" v-if="errors.name">
                                    {{ errors.name[0] }}
                                </p>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="email">Email</label>
                            <div class="control">
                                <input class="input" type="email" id="email" v-model="email" :class="{ 'is-danger': errors.email }">
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
                                <button class="button is-link">Register</button>
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

export default {
  data () {
    return {
      name: null,
      email: null,
      password: null,
      errors: []
    }
  },
  methods: {
    ...mapActions({
      register: 'auth/register'
    }),
    async submit () {
      let response = await this.register({
        payload: {
          name: this.name,
          email: this.email,
          password: this.password
        },
        context: this
      })

      if (response.status === 200) {
        this.$router.replace({ name: '/' })
      }
    }
  }
}
</script>
