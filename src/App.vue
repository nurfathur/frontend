<template>
  <v-app>
    <!-- Modern minimalist app bar with subtle elevation -->
    <v-app-bar 
      app 
      elevation="1"
      color="white"
      height="70"
    >
      <v-container class="pa-0 d-flex align-center">
        <v-app-bar-title class="text-h5 font-weight-medium primary--text">
          File Upload System
        </v-app-bar-title>
        <v-spacer></v-spacer>
        
        <!-- Modern navigation buttons with hover effects -->
        <v-btn 
          :to="{ name: 'home' }" 
          text 
          class="text-subtitle-1 font-weight-medium px-4"
          color="primary"
        >
          Home
        </v-btn>
        <v-btn 
          :to="{ name: 'about' }" 
          text
          class="text-subtitle-1 font-weight-medium px-4"
          color="primary"
        >
          About
        </v-btn>
        
        <!-- Adding a profile avatar button for modern touch -->
        <v-btn icon class="ml-4">
          <v-avatar size="36" color="grey lighten-4">
            <v-icon color="grey darken-3">mdi-account</v-icon>
          </v-avatar>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main content area with subtle background -->
    <v-main class="grey lighten-5">
      <v-container class="py-8">
        <!-- Card wrapper for content -->
        <v-card
          class="mx-auto"
          elevation="2"
          max-width="1200"
          rounded="lg"
        >
          <v-card-text class="pa-6">
            <router-view />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Modern footer with subtle separation -->
    <v-footer app padless color="white" elevation="3">
      <v-container>
        <div class="d-flex flex-column flex-md-row justify-space-between align-center py-2">
          <div class="text-body-2 grey--text text--darken-1">
            {{ new Date().getFullYear() }} — <strong class="primary--text">File Upload System</strong>
          </div>
          <!-- Adding social media icons for modern look -->
          <div class="mt-3 mt-md-0">
            <v-btn icon small class="mx-1">
              <v-icon size="18" color="grey darken-1">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon small class="mx-1">
              <v-icon size="18" color="grey darken-1">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon small class="mx-1">
              <v-icon size="18" color="grey darken-1">mdi-instagram</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    // Add any data properties here if needed
  }),
}
</script>

<style>
/* Adding some global modern styling */
.v-application {
  font-family: 'Roboto', 'Segoe UI', sans-serif !important;
  line-height: 1.6;
}

/* Custom transitions for router views */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>