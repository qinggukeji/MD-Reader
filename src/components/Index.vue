<template>
  <!-- <div class="index" v-html="test"></div> -->
  <Back-top></Back-top>
</template>

<script>
import Marked from 'marked'
import Vue from 'vue'

Marked.setOptions({
  renderer: new Marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

export default {
  name: 'index',
  // props: ['body'],
  data () {
    return {
      test: 'testss'
    }
  }
}
Vue.component('child', {

  props: ['message'],
  template: '<span @click="changer">{{ message }}</span>',
  methods: {
    changer: function (val) {
      this.message = Marked(this.message)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
