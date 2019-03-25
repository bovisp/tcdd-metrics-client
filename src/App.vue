<template>
  <div>
    <Navigation></Navigation>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
export default {
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
@import "./style/style.scss";
</style>
