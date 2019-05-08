<template>
  <section>

    <!-- index table -->
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a course to update or delete its course group.
          </b-message>
        </div>
        <div class="is-flex my-4">
          <router-link :to="{ name: 'createMultilingualCourse' }" class="button is-link ml-auto">Create</router-link>
        </div>
        <b-table style="margin-bottom: 1.5rem;"
          :data="data"
          :columns="columns"
          :selected.sync="selected"
          :striped="true"
          paginated
          per-page="10"
          pagination-simple>
        </b-table>
      </div>
    </div>

    <!-- edit/delete footer -->
    <div class="fixed-bottom has-background-white-ter" v-if="selected.course_id != null">
        <div class="container">
          <div class="columns">
            <div class="column is-half is-offset-one-quarter is-flex">
              <button class="button is-link" style="margin-left: auto; margin-right: 1rem;"
                @click="isUpdateModalActive = true, openModal()"
                :disabled="!selected.course_id">Edit</button>
              <button class="button is-danger" @click="confirmDelete" style="margin-right: 1rem;">Delete</button>
              <button class="button is-text" @click="selected = {}">Clear Selected</button>
            </div>
          </div>
        </div>
    </div>

    <!-- edit modal -->
    <b-modal :active.sync="isUpdateModalActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-content">
          <form v-on:submit.prevent="submit">
            <div class="field">
              <label class="label">Course</label>
              <p>{{ selected.fullname }}</p>
            </div>
            <div class="field">
              <label class="label">Course Group</label>
              <div class="control">
                <b-select v-model="selectedCourseGroup.id">
                  <option
                    v-for="courseGroup in courseGroups"
                    :value="courseGroup.id"
                    :key="courseGroup.id">
                    {{ courseGroup.name }}
                  </option>
                </b-select>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-link">Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isUpdateModalActive: false,
      courseGroups: [],
      data: [],
      selected: {},
      submitData: {
        course_id: null,
        multilingual_course_group_id: null
      },
      selectedCourseGroup: { id: null },
      columns: [
        {
          field: 'fullname',
          label: 'Course'
        },
        {
          field: 'course_group_name',
          label: 'Group Name',
          width: 150
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      axios.get('/api/multilingual-courses').then(response => {
        this.data = response.data
      })
    },
    openModal () {
      axios.get('/api/multilingual-course-groups').then(response => {
        this.courseGroups = response.data
      })
      this.selectedCourseGroup = {
        id: this.selected.multilingual_course_group_id,
        name: this.selected.course_group_name
      }
    },
    refreshTable () {
      this.init()
      this.selected = {}
    },
    confirmDelete () {
      this.$dialog.confirm({
        message: 'Do you really want to delete this multilingual course?',
        type: 'is-danger',
        onConfirm: () => this.deleteOnConfirm()
      })
    },
    deleteOnConfirm () {
      if (!this.selected.id) {
        this.toast('dark', 'Please select a course.')
        return
      }
      axios.delete(`/api/multilingual-courses/${this.selected.id}`).then(response => {
        this.toast('success', response.data)
        this.refreshTable()
      }).catch(error => {
        this.$dialog.alert({
          message: error.response.data,
          type: 'is-danger'
        })
      })
    },
    submit (e) {
      if (!this.selectedCourseGroup) {
        this.toast('dark', 'Please select a course group.')
        return
      }
      this.submitData.course_id = this.selected.course_id
      this.submitData.multilingual_course_group_id = this.selectedCourseGroup.id
      axios.put(`/api/multilingual-courses/${this.selected.id}`, this.submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.refreshTable()
          this.isUpdateModalActive = false
        }.bind(this)), 1000)
      }).catch(error => {
        this.snackbar('warning', error.response.data)
      })
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    },
    snackbar (type = 'dark', message) {
      this.$snackbar.open({
        type: `is-${type}`,
        message
      })
    }
  }
}
</script>
