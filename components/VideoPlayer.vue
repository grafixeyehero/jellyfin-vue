<template>
  <v-container fill-height fluid class="pa-0">
    <div ref="videoContainer">
      <video ref="videoPlayer" :poster="poster" autoplay></video>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import shaka from 'shaka-player/dist/shaka-player.ui';
import muxjs from 'mux.js';
import 'shaka-player/dist/controls.css';

export default Vue.extend({
  props: {
    source: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      player: null as unknown,
      ui: null as unknown
    };
  },
  watch: {
    async source(newSource) {
      console.warn(newSource);
      if (this.player) {
        try {
          await this.player.load(newSource);
        } catch (e) {
          console.error('Error code', e.code, 'object', e);
        }
      }
    }
  },
  mounted() {
    window.muxjs = muxjs;
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      this.player = new shaka.Player(this.$refs.videoPlayer);
      this.ui = new shaka.ui.Overlay(
        this.player,
        this.$refs.videoContainer,
        this.$refs.videoPlayer
      );
    } else {
      this.$nuxt.error({
        message: this.$t('browserNotSupported') as string
      });
    }
  },
  beforeDestroy() {
    if (this.player) {
      window.muxjs = undefined;
      this.player.unload();
      this.player.destroy();
    }
  }
});
</script>

<style scoped>
video {
  width: 100vw;
  height: 100vh;
}
</style>
