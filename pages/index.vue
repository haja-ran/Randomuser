<template>
  <section class="section has-background-light">
    <div class="container">
      <form @submit.prevent="onSubmit()" class="box ">
        <div class="columns" style="align-items: flex-end;">
          <div class="column is-2">
            <b-field label="Number of users">
              <b-input v-model="form.number" type="number"></b-input>
            </b-field>
          </div>

          <div class="column is-2">
            <b-field label="Gender">
              <b-select v-model="form.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </b-select>
            </b-field>
          </div>

          <div class="column is-offset-3 is-2">
            <b-button :disabled="!users.length" @click="users = []" expanded>Reset</b-button>
          </div>

          <div class="column is-3 has-text-right">
            <button
              :class="{ 'is-loading': isLoading }"
              class="button is-primary is-fullwidth"
            >
              <span>Generate</span>
            </button>
          </div>
        </div>
      </form>

      <div class="columns is-multiline">
        <div
          v-for="(user, index) in users"
          :key="user.id.value"
          class="column is-4"
        >
          <b-collapse :ref="'user-' + index" class="card" :open="false">
            <div
              slot="trigger"
              class="card-header"
              role="button"
            >
              <div
                class="box is-borderless is-shadowless is-radiusless is-fullwidth"
              >
                <div class="media flex-align-center">
                  <div class="media-left">
                    <figure class="image">
                      <img class="is-rounded" :src="user.picture.thumbnail" />
                    </figure>
                  </div>

                  <div class="media-content">
                    <p class="title is-5">
                      {{ user.name.title }} {{ user.name.last }}
                      {{ user.name.first }}
                    </p>
                    <p class="subtitle is-7">
                      {{ user.email }}
                    </p>
                  </div>

                  <div class="media-right">
                    <b-icon icon="plus-circle"></b-icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-content has-text-7">
              <p><strong>Gender:</strong> {{ user.gender }}</p>

              <p>
                <strong>Street:</strong> {{ user.location.street.number }}
                {{ user.location.street.name }}
              </p>
              <p>
                <strong>Adress:</strong>
                {{ user.location.city }}
                {{ user.location.state }}
                {{ user.location.country }}
                {{ user.location.postcode }}
              </p>

              <p><strong>Nationality:</strong> {{ user.nat }}</p>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '~/services/api'

export default {
  name: 'HomePage',

  data() {
    return {
      form: {
        number: 6,
        gender: 'male'
      },

      users: [],

      isLoading: false
    }
  },

  methods: {
    success(message) {
      this.$buefy.toast.open({
        type: 'is-success',
        message
      })
    },

    error(message) {
      this.$buefy.toast.open({
        type: 'is-danger',
        message
      })
    },

    generateUsers(results, gender) {
      if (results < 1) return
      this.isLoading = true
      api
        .getUsers(results, gender)
        .then(res => {
          const newUsers = res.data.results
          this.users = [...this.users, ...newUsers]
          this.success(
            newUsers.length + ' new user' + (newUsers.length > 1 ? 's' : '')
          )
          this.isLoading = false
          setTimeout(() => {
            this.scrollToLastUser()
          }, 100)
        })
        .catch(e => {
          this.error(e.message)
          this.isLoading = false
        })
    },

    onSubmit() {
      this.generateUsers(this.form.number, this.form.gender)
    },

    scrollToLastUser() {
      const lastUserIndex = this.users.length - 1
      const lastUser = this.$refs['user-' + lastUserIndex]
      if (!lastUser) return
      lastUser[0].$el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 6px;
  overflow: hidden;
}

section.section {
  min-height: 100vh;
}

.flex-align-center {
  align-items: center;
}

.is-fullwidth {
  width: 100%;
}
</style>
