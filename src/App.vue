<template>
  <v-app>
    <v-toolbar app d-flex align-center>
      <v-toolbar-title>KegVu</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <HelloWorld/>
    </v-content>
    <v-footer fixed app>
      <span>&copy; {{ (new Date()).getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      items: [],
    };
  },
}
</script>
