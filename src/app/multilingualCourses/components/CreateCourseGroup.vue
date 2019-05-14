<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please enter a course group name.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
            <div class="field">
                <div class="control">
                <b-field label="Course Group Name">
                    <input class="input"
                    id="courseGroupName"
                    placeholder="Enter a course group name..."
                    autofocus
                    v-model="courseGroupName"
                    :class="{ 'is-danger': errors.course_group_name }">
                </b-field>
                <p class="help is-danger" v-if="errors.course_group_name">
                    {{ errors.course_group_name[0] }}
                </p>
                </div>
            </div>
          <div class="field">
            <div class="control">
              <button class="button is-link" style="margin-bottom: 1.5rem;">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      submitData: {
        course_group_name: null
      },
      courseGroupName: '',
      errors: {}
    }
  },
  methods: {
    async submit (e) {
      if (!this.courseGroupName) {
        this.toast('dark', 'Please enter a course group name.')
        return
      }
      this.submitData.course_group_name = this.courseGroupName
      axios.post('/api/multilingual-course-groups', this.submitData).then(response => {
        this.toast('success', response.data.message)
        setTimeout((function () {
          this.$router.replace({ name: 'createMultilingualCourse' })
        }.bind(this)), 1000)
      }).catch(e => {
        this.errors = e.response.data.errors
      })
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  },
  mounted () {
  }
}
</script>
