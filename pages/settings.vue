<template>
  <v-container fluid class="pa-0" t-if="$vuetify.breakpoint.isMobile">
    <v-row no-gutters>
      <v-col cols="12">
        <v-list subheader>
          <div v-for="(item, i) in items" :key="i">
            <v-subheader v-if="item.type === 'subheader'">
              {{ item.title }}
            </v-subheader>
            <v-divider v-else-if="item.type === 'divider'"></v-divider>
            <v-list-item v-else :to="item.to" two-line>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.subtitle">
                  {{ item.subtitle }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    items() {
      return [
        {
          title: this.$t('userSettings'),
          to: '/settings/user'
        },
        {
          type: 'divider'
        },
        {
          title: this.$t('client'),
          type: 'subheader'
        },
        {
          title: this.$t('playbackSettings'),
          to: '/'
        }
      ];
    }
  }
});
</script>

<style scoped>
.v-sheet {
  background: none;
}
</style>
