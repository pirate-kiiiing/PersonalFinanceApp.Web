<template>
  <div class="wrapper">
    <div :style="paddingTopStyle"></div>
    <div align="center">
      <span class="title pirate">Pirate</span>
      <span class="title king">King</span>
    </div>
    <div class="padding-middle"></div>
    <div 
      align="center" 
      :hidden="layoutStore.showSignInButton === false"
      @click.prevent="onClick"
    >
      <g-signin-button
        class="button"
        :params="googleSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError">
        Sign in with Google
      </g-signin-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GSignInButton from 'vue-google-signin-button';
import layoutStore from '@/layout/_store';
import tenant from '@/tenant/_store';
import { device } from '@/shared/_tools';

Vue.use(GSignInButton);

@Component
export default class Home extends Vue {
  // data
  public googleSignInParams = {
    client_id: '234897733692-sgd12l4mbr0d04pjhi3in33ca2oe10jc.apps.googleusercontent.com',
  };
  public layoutStore = layoutStore;

  // style
  get paddingTopStyle() {
    return {
      height: (device.isMobile() === true) ? '230px' : '300px',
    };
  }

  // methods
  public onClick(): void {
    layoutStore.toggleSignInButton(false);
  }

  public async onSignInSuccess(googleUser): Promise<void> {
    // `googleUser` is the GoogleUser object that represents the just-signed-in user.
    // See https://developers.google.com/identity/sign-in/web/reference#users
    const profile = googleUser.getBasicProfile(); // etc etc
    const googleToken = googleUser.getAuthResponse().id_token;

    await tenant.signIn({
      googleToken,
      path: this.$router.currentRoute.path,
    });
  }

  public onSignInError(error) {
    // tslint:disable-next-line
    console.error(error);

    layoutStore.toggleSignInButton(true);
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  // align-items: center;
  background-color: #2a2a2a;
  // display: flex;
  height: 100vh;
  // justify-content: center;
  width: 100vw;
}

.button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #6e6d70;
  color: #e0e0e0;
  box-shadow: 0 3px 0 #897129;
  font-family: Geneva, Tahoma, Verdana, sans-serif;
}

.pirate {
  color: #907200;
}

.king {
  color: #8a898d;
}

.padding-middle {
  height: 40px;
}

.title {
  font-size: 70px;
  font-family: Geneva, Tahoma, Verdana, sans-serif;
}
</style>
