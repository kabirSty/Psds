<template>
  <div class="wrapper">
  <div class="phone">
    <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
    <nav class="nav nav--icons fixed-bottom">
      <ul>
        <li>
          <a href="#home">
            <svg class="icon icon-home" viewBox="0 0 24 24" width="24" height="24">
<path fill="currentColor" d="M21.6 8.2l-9-7c-0.4-0.3-0.9-0.3-1.2 0l-9 7c-0.3 0.2-0.4 0.5-0.4 0.8v11c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-11c0-0.3-0.1-0.6-0.4-0.8zM14 21h-4v-8h4v8zM20 20c0 0.6-0.4 1-1 1h-3v-9c0-0.6-0.4-1-1-1h-6c-0.6 0-1 0.4-1 1v9h-3c-0.6 0-1-0.4-1-1v-10.5l8-6.2 8 6.2v10.5z"></path>
            </svg>
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="#news">
            <svg class="icon icon-news" viewBox="0 0 24 24" width="24" height="24">
<path fill="currentColor" d="M17 2h-10c-1.7 0-3 1.3-3 3v16c0 0.4 0.2 0.7 0.5 0.9s0.7 0.1 1-0.1l6.4-4.6 6.4 4.6c0.2 0.1 0.4 0.2 0.6 0.2s0.3 0 0.5-0.1c0.3-0.2 0.5-0.5 0.5-0.9v-16c0.1-1.7-1.2-3-2.9-3zM18 19.1l-5.4-3.9c-0.2-0.1-0.4-0.2-0.6-0.2s-0.4 0.1-0.6 0.2l-5.4 3.9v-14.1c0-0.6 0.4-1 1-1h10c0.6 0 1 0.4 1 1v14.1z"></path>
            </svg>
            <span>News</span>
          </a>
        </li>
        <li>
          <a href="#profile">
            <svg class="icon icon-profile" viewBox="0 0 24 24" width="24" height="24">
              <g fill="currentColor">
                <path d="M16 14h-8c-2.8 0-5 2.2-5 5v2c0 0.6 0.4 1 1 1s1-0.4 1-1v-2c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3v2c0 0.6 0.4 1 1 1s1-0.4 1-1v-2c0-2.8-2.2-5-5-5z"></path>
<path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM12 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"></path>
              </g>
            </svg>
            <span>Profile</span>    
          </a>
        </li>
        <li>
          <a href="#search">
            <svg class="icon icon-search" viewBox="0 0 24 24" width="24" height="24">
<path fill="currentColor" d="M21.7 20.3l-3.7-3.7c1.2-1.5 2-3.5 2-5.6 0-5-4-9-9-9s-9 4-9 9c0 5 4 9 9 9 2.1 0 4.1-0.7 5.6-2l3.7 3.7c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4zM4 11c0-3.9 3.1-7 7-7s7 3.1 7 7c0 1.9-0.8 3.7-2 4.9 0 0 0 0 0 0s0 0 0 0c-1.3 1.3-3 2-4.9 2-4 0.1-7.1-3-7.1-6.9z"></path>
            </svg>
            <span>Search</span>    
          </a>
        </li>
      </ul>
    </nav>

  </div>
</div>
</template>


<script>
import BackToTop           from 'vue-backtotop'
import HNavMenu            from "@/layouts/components/horizontal-nav-menu/HorizontalNavMenu.vue"
import navMenuItems        from "@/layouts/components/vertical-nav-menu/navMenuItems.js"
import TheCustomizer       from "@/layouts/components/customizer/TheCustomizer.vue"
import TheNavbarHorizontal from '@/layouts/components/navbar/TheNavbarHorizontal.vue'
import TheNavbarVertical   from '@/layouts/components/navbar/TheNavbarVertical.vue'
import TheFooter           from '@/layouts/components/TheFooter.vue'
import themeConfig         from '@/../themeConfig.js'
import VNavMenu            from '@/layouts/components/vertical-nav-menu/VerticalNavMenu.vue'

const VxTour = () => import('@/components/VxTour.vue')

export default {
  components: {
    BackToTop,
    HNavMenu,
    TheCustomizer,
    TheFooter,
    TheNavbarHorizontal,
    TheNavbarVertical,
    VNavMenu,
    VxTour
  },
  data() {
    return {
      disableCustomizer : themeConfig.disableCustomizer,
      disableThemeTour  : themeConfig.disableThemeTour,
      dynamicWatchers   : {},
      footerType        : themeConfig.footerType  || 'static',
      hideScrollToTop   : themeConfig.hideScrollToTop,
      isNavbarDark      : false,
      navbarColor       : themeConfig.navbarColor || '#fff',
      navbarType        : themeConfig.navbarType  || 'floating',
      navMenuItems      : navMenuItems,
      routerTransition  : themeConfig.routerTransition || 'none',
      routeTitle        : this.$route.meta.pageTitle,
      steps: [{
          target  : '#btnVNavMenuMinToggler',
          content : 'Toggle Collapse Sidebar.'
        },
        {
          target  : '.vx-navbar__starred-pages',
          content : 'Create your own bookmarks. You can also re-arrange them using drag & drop.'
        },
        {
          target  : '.i18n-locale',
          content : 'You can change language from here.'
        },
        {
          target  : '.navbar-fuzzy-search',
          content : 'Try fuzzy search to visit pages in flash.'
        },
        {
          target  : '.customizer-btn',
          content : 'Customize template based on your preference',
          params  : {
            placement: 'left'
          }
        },
        {
          target  : '.vs-button.buy-now',
          content : 'Buy this awesomeness at affordable price!',
          params  : {
            placement: 'top'
          }
        },
      ],
    }
  },
  watch: {
    // "$route"() {
    //   this.routeTitle = this.$route.meta.pageTitle
    // },
    // isThemeDark(val) {
    //   const color = this.navbarColor == "#fff" && val ? "#10163a" : "#fff"
    //   this.updateNavbarColor(color)
    // },
    // "$store.state.mainLayoutType"(val) {
    //   this.setNavMenuVisibility(val)
    //   this.disableThemeTour = true
    // }
  },
  computed: {
    // bodyOverlay() { return this.$store.state.bodyOverlay },
    // contentAreaClass() {
    //   if(this.mainLayoutType === "vertical") {
    //     if      (this.verticalNavMenuWidth == "default") return "content-area-reduced"
    //     else if (this.verticalNavMenuWidth == "reduced") return "content-area-lg"
    //     else return "content-area-full"
    //   }
    //   // else if(this.mainLayoutType === "boxed") return "content-area-reduced"
    //   else return "content-area-full"
    // },
    // footerClasses() {
    //   return {
    //     'footer-hidden': this.footerType == 'hidden',
    //     'footer-sticky': this.footerType == 'sticky',
    //     'footer-static': this.footerType == 'static',
    //   }
    // },
    // isAppPage() {
    //   return this.$route.meta.no_scroll
    // },
    // isThemeDark()     { return this.$store.state.theme == 'dark' },
    // layoutTypeClass() { return `main-${this.mainLayoutType}` },
    // mainLayoutType()  { return this.$store.state.mainLayoutType  },
    // navbarClasses()   {
    //   return {
    //     'navbar-hidden'   : this.navbarType == 'hidden',
    //     'navbar-sticky'   : this.navbarType == 'sticky',
    //     'navbar-static'   : this.navbarType == 'static',
    //     'navbar-floating' : this.navbarType == 'floating',
    //   }
    // },
    // verticalNavMenuWidth() { return this.$store.state.verticalNavMenuWidth },
    // windowWidth()          { return this.$store.state.windowWidth }
  },
  methods: {
    // changeRouteTitle(title) {
    //   this.routeTitle = title
    // },
    // updateNavbar(val) {
    //   if (val == "static") this.updateNavbarColor(this.isThemeDark ? "#10163a" : "#fff")
    //   this.navbarType = val
    // },
    // updateNavbarColor(val) {
    //   this.navbarColor = val
    //   if (val == "#fff") this.isNavbarDark = false
    //   else this.isNavbarDark = true
    // },
    // updateFooter(val) {
    //   this.footerType = val
    // },
    // updateRouterTransition(val) {
    //   this.routerTransition = val
    // },
    // setNavMenuVisibility(layoutType) {
    //   if((layoutType === 'horizontal' && this.windowWidth >= 1200) || (layoutType === "vertical" && this.windowWidth < 1200)) {
    //     this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
    //     this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')
    //   }
    //   else {
    //     this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)
    //   }
    // },
    // toggleHideScrollToTop(val) {
    //   this.hideScrollToTop = val
    // }
  },
  created() {
    // const color = this.navbarColor == "#fff" && this.isThemeDark ? "#10163a" : this.navbarColor
    // this.updateNavbarColor(color)
    // this.setNavMenuVisibility(this.$store.state.mainLayoutType)

    // // Dynamic Watchers for tour
    // // Reason: Once tour is disabled it is not required to enable it.
    // // So, watcher is required for just disabling it.
    // this.dynamicWatchers.windowWidth = this.$watch("$store.state.windowWidth", (val) => {
    //   if(val < 1200) {
    //     this.disableThemeTour = true
    //     this.dynamicWatchers.windowWidth()
    //   }
    // })

    // this.dynamicWatchers.verticalNavMenuWidth = this.$watch("$store.state.verticalNavMenuWidth", () => {
    //   this.disableThemeTour = true
    //   this.dynamicWatchers.verticalNavMenuWidth()
    // })

    // this.dynamicWatchers.rtl = this.$watch("$vs.rtl", () => {
    //   this.disableThemeTour = true
    //   this.dynamicWatchers.rtl()
    // })
  },
  beforeDestroy() {
    // Object.keys(this.dynamicWatchers).map(i => {
    //   this.dynamicWatchers[i]()
    //   delete this.dynamicWatchers[i]
    // })
  }
}

</script>

<style type="text/css">
  .wrapper {
  max-width: 320px;
  margin: 2em auto;
}
.phone {
  border: 2px solid #eee;
  border-radius: 2em;
  position: relative;
  padding-bottom: 170%;
  height: 0;
  overflow: hidden;
  width: 100%;
  height: auto;
  box-shadow: 0 40px 80px rgba(0,0,0,0.15);
}
.nav--icons {
  position: absolute;
  bottom: 2em;
  left: 1em;
  right: 1em;
}
.nav--icons ul {
  list-style-type: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0;
  margin: 0;
}
.nav--icons ul li a {
  font-family: sans-serif;
  font-size: 11px;
  letter-spacing: 1px;
  text-decoration: none;
  color: #000;
  line-height: 1;
  vertical-align: middle;
  display: flex;
  align-items: center;
  border-radius: 3em;
  padding: 0.75em 1.25em;
  transition: 0.6s ease-in-out;
}
.nav--icons ul li a span {
  display: inline-block;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  padding-left: 0.5em;
  transform: translate3d(-0.5em, 0, 0);
  transition: opacity 0.6s, max-width 0.6s, transform 0.6s;
  transition-timing-function: ease-in-out;
}
.nav--icons ul li a:hover,
.nav--icons ul li a.is-active {
  color: #fff;
  background-color: #000;
}
.nav--icons ul li a:hover span,
.nav--icons ul li a.is-active span {
  opacity: 1;
  max-width: 40px;
  transform: translate3d(0, 0, 0);
}

</style>