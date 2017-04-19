<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-contents{
        padding-left: 200px;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
        position: fixed;
        width: 200px;
        height: 100%;
        z-index: 999;
        overflow: auto;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-header > h1 {
        font-size: 2em !important;
        padding: 17px 30px;
        margin: 0 !important;
    }
    .layout-header > h1 > i {
        margin-left: 20px;
    }
    .layout-logo-left{
        width: 90%;
        margin: 15px 9px auto;
    }
    .demo-spin-container{
      display: inline-block;
      width: 200px;
      height: 100px;
      position: relative;
      border: 1px solid #eee;
    }
    .ivu-menu-item-active,
    .ivu-menu-item-selected {
      color: #9ea7b4 !important; 
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
      background: #313540 !important; 
    }
</style>
<style>
    p {
      margin-bottom: 1rem !important;
      font-size: .9rem;
    }
    pre {
      border: 1px solid #eceeef;
      border-radius: 5px;
      display: inline-block;
      padding: 10px;
    }
    h1 {
      font-size: 3em !important;
    }
    h1, h2, h3 {
      margin: 35px 0 !important
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active > .ivu-menu-submenu-title {
      color: #9ea7b4 !important;
    }
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <i-col span="5" class="layout-menu-left">
                <Select class="layout-logo-left" v-model="select" @on-change="changeVersion">
                    <Option v-for="item in versions" :value="item.v" :key="item">{{ item.v }}</Option>
                </Select>
                <Menu v-for="(title, key) in menu" theme="dark" width="auto" :key="title.key" :value="title.name" @on-select="turnPage" @on-open-change="turnPageTitle">
                    <Submenu v-bind:name="title.id" >
                        <template slot="title">
                            {{ title.name }}
                        </template>
                        <div v-if="title.list.length" v-for="(list, k) in title.list">
                          <Menu-item v-bind:name="list.id">{{ list.name }}</Menu-item>
                        </div>
                    </Submenu>
                </Menu>
                <!-- <Menu theme="dark" width="auto" active-name="1" @on-select="turnPage"> -->
                    <!-- <Menu-group v-for="(title, key) in menu" v-bind:title="title.name" v-on:click="turnPageTitle" :key="title.key"> -->
                        <!-- <Menu-item v-for="(list, k) in title.list" v-bind:name="list.id" :key="list.id"> -->
                            <!-- <Icon type="ios-keypad"></Icon> -->
                            <!-- {{ list.name }} -->
                        <!-- </Menu-item> -->
                    <!-- </Menu-group> -->
                <!-- </Menu> -->
            </i-col>
            <i-col span="24" class="layout-contents">
                <div class="layout-header">
                  <h1>{{ select }}<Icon type="network"></Icon></h1>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                      <div id="app">
                        <child :message="body" v-html="body"></child>
                        <router-view></router-view>
                      </div>
                    </div>
                </div>
                <div class="layout-copy">
                    2015-2017 &copy; QingGu
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
      name: 'app',
      data () {
        return {
          versions: [],
          body: '',
          menu: {},
          select: 'xxx',
          target: [],
          mark: ''
        }
      },
      created: function () {
        this.$http.get('static/menu.json').then(response => {
          this.versions = response.body
          this.select = this.versions[0].v
          // this.changeVersion(this.versions[0].v)
        }, response => {
          console.log(response)
        })
      },
      updated: function () {
        this.$nextTick(function () {
          var list = this.$el.querySelectorAll('.ivu-menu-submenu')
          for (var i = 0; i < list.length; i++) {
            if (list[i].querySelector('ul').getElementsByTagName('li').length === 0) {
              // rm icon
              list[i].querySelector('.ivu-icon-ios-arrow-down').remove()
            }
          }
        })
      },
      watch: {
      },
      methods: {
        changeVersion: function (val) {
          this.$http.get('static/docs/' + val + '.json').then(response => {
            this.body = response.body.data
            this.menu = response.body.menu
            this.target = []
            response.body.menu.map((index, elem) => {
              this.target[index.id] = index.target
              if (index.list.length !== 0) {
                index.list.map((i, elem, array) => {
                  this.target[i.id] = i.target
                })
              }
            })
          }, response => {
            this.$Notice.error({
              title: 'Error: ' + response.status + ' - ' + response.statusText
            })
          })
        },
        turnPage: function (name) {
          var anchor = this.$el.querySelector('#' + this.target[name])
          this.scrollTop(window, document.body.scrollTop, anchor.offsetTop, 600)
        },
        turnPageTitle: function (name) {
          // this.$el.getElementsByClassName('ivu-menu-opened') = this.$el.getElementsByClassName('ivu-menu-opened').className.replace(reg, ' ')
          if (name[0]) {
            this.mark = name[0]
          }
          var anchor
          if (name[0]) {
            anchor = this.$el.querySelector('#' + this.target[name[0]])
            this.scrollTop(window, document.body.scrollTop, anchor.offsetTop, 600)
          } else {
            anchor = this.$el.querySelector('#' + this.target[this.mark])
            this.scrollTop(window, document.body.scrollTop, anchor.offsetTop, 600)
          }
        },
        scrollTop: (el, from = 0, to, duration = 500) => {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (callback) {
                return window.setTimeout(callback, 1000 / 60)
              }
            )
          }
          const difference = Math.abs(from - to)
          const step = Math.ceil(difference / duration * 50)

          function scroll (start, end, step) {
            if (start === end) return

            let d = (start + step > end) ? end : start + step
            if (start > end) {
              d = (start - step < end) ? end : start - step
            }

            if (el === window) {
              window.scrollTo(d, d)
            } else {
              el.scrollTop = d
            }
            window.requestAnimationFrame(() => scroll(d, end, step))
          }
          scroll(from, to, step)
        }
      }
    }
</script>
