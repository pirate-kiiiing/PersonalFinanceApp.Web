<template>
  <div id="app">
    <div v-if="layout.page === Page.Default">
      <Layout />
    </div>
    <div v-else-if="layout.page === Page.Home">
      <Home />
    </div>
    <div v-else-if="layout.page === Page.Redirect">
      <Redirect />
    </div>
    <div v-else-if="layout.page === Page.Privacy">
      <Privacy />
    </div>
    <div v-else>
      <NotFound />
    </div>
    <Loader />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import NotFound from '@/404/NotFound.vue';
import { Menus, Page, Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import Layout from '@/layout/Layout.vue';
import Loader from '@/layout/Loader.vue';
import Home from '@/home/Home.vue';
import { storageTools } from '@/shared/_tools';
import tenant from '@/tenant/_store';

@Component({
  components: {
    Layout,
    Loader,
    NotFound,
    Home,
    Redirect,
    Privacy,
  },
})
export default class App extends Vue {
  // data
  public layout = layout;
  public Page = Page;

  // lifecycle
  /**
   * Mounted on App.vue is always called ONCE on initial page load.
   * For known paths, $route.path is always '/'.
   * When you access the page with route path (e.g. /assets),
   * the site will initially enter mounted with '/', and
   * vue router will then change it to '/assets'.
   */
  public async mounted(): Promise<void> {
    let path: string = window.location.pathname;
    // remove trailing slash if it exists
    path = (path.charAt(path.length - 1) === '/')
      ? path.slice(0, -1) : path;
    /**
     * In order to correctly navigate to the path user entered from gh-pages,
     * we need to use 404.html that sets the path on session storage.
     * It will redirect users back to index.html, and we can use the path accordingly.
     */
    if (storageTools.hasPath() === true) {
      path = storageTools.getPath();
      storageTools.removePath();
      this.$router.push(path);
    }

    if (Menus.IsValidPath(path) === false) {
      layout.setPage(Page.NotFound);
      return;
    } else {
      // sign in using cookie
      await tenant.signIn({
        path,
      });
    }
  }

  // computed
  get route() {
    return this.$route;
  }

  @Watch('route')
  public onRouteChange(newRoute, oldRoute): void {
    if (layout.page !== Page.Default) {
      return;
    }
    // handle back button menu changes
    const menuName: string = newRoute.name;
    layout.setMenu(menuName);
  }

  // methods
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("light", (
  primary: md-get-palette-color(cyan, 300),
  accent: md-get-palette-color(red, A200),
));

@include md-register-theme("dark", (
  primary: md-get-palette-color(lightblue, 200),
  accent: md-get-palette-color(red, A200),
  theme: dark,
));

@import "~vue-material/dist/theme/all"; // Apply the theme
// @import "~vue-material/dist/components/MdToolbar/theme";
// @import "~vue-material/dist/components/MdDrawer/theme";
</style>
