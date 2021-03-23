<template>
  <v-app id="inspire">
    <Toolbar />
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="d-print-none" app>
      <span>Calendário &copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
import Toolbar from '@/components/core/Toolbar.vue';

export default {
  name: 'App',
  components: {
    Toolbar,
  },

  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>
