<template>
  <v-container fill-height fluid class="pa-0">
    <video-player :source="source" :poster="poster" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { PlaybackInfoResponse } from '~/api/api';
import imageHelper from '~/mixins/imageHelper';

export default Vue.extend({
  layout: 'fullpage',
  mixins: [imageHelper],
  data() {
    return {
      poster: '',
      item: [] as PlaybackInfoResponse,
      source: '',
      audioTracks: []
    };
  },
  async beforeMount() {
    try {
      this.poster = this.getImageLink(this.$route.params.itemId, 'backdrop');
      const response = await this.$mediaInfoApi.getPostedPlaybackInfo({
        itemId: this.$route.params.itemId,
        userId: this.$auth.user.Id,
        deviceProfileDto: {
          DeviceProfile: this.$playbackProfile
        }
      });

      this.item = response.data.MediaSources[0];
      console.dir(this.item);

      if (this.item.StreamUrl) {
        // TODO: Apparently only for audio. Double check.
        this.source =
          this.$axios.defaults.baseURL +
          response.data.MediaSources[0].StreamUrl;
      } else if (this.item.SupportsDirectStream) {
        const directOptions = {
          Static: true,
          mediaSourceId: this.item.Id,
          deviceId: this.$store.state.deviceProfile.deviceId,
          api_key: this.$store.state.user.accessToken
        };

        if (this.item.ETag) {
          directOptions.Tag = this.item.ETag;
        }

        if (this.item.LiveStreamId) {
          directOptions.LiveStreamId = this.item.LiveStreamId;
        }

        const params = new URLSearchParams(directOptions);
        this.source = `${this.$axios.defaults.baseURL}/Videos/${
          this.item.Id
        }/stream.${this.item.Container}?${params.toString()}`;
      } else if (this.item.SupportsTranscoding) {
        this.source =
          this.$axios.defaults.baseURL +
          response.data.MediaSources[0].TranscodingUrl;
      }
    } catch (error) {
      this.$nuxt.error({
        statusCode: 404,
        message: error
      });
    }
  }
});
</script>
