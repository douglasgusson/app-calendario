<template v-slot:activator="{ on }">
  <div>
    <v-navigation-drawer v-model="drawer" app clipped class="d-print-none">
      <v-list dense>
        <v-list-item
          :key="i"
          v-for="(route, i) in $router.options.routes"
          link
          :to="route.path"
        >
          <v-list-item-content>
            <v-list-item-title>{{ route.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left class="d-print-none">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Calendário</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
  }),
};
</script>

<style>
</style>