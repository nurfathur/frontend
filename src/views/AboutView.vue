<template>
  <div class="about">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="9">
          <!-- Header Section -->
          <div class="text-center mb-6">
            <v-chip color="secondary" variant="elevated" class="mb-3 px-3 text-uppercase font-weight-bold">
              <v-icon start>mdi-information</v-icon>
              About
            </v-chip>
            <h1 class="text-h3 font-weight-bold mb-2">About This Application</h1>
            <p class="text-body-1 text-medium-emphasis max-width-500 mx-auto">
              Learn more about our file management system and its capabilities.
            </p>
          </div>
          
          <!-- About Content Card -->
          <v-card class="rounded-lg" variant="outlined">
            <v-card-text class="pa-6">
              <div class="d-flex flex-column gap-6">
                <!-- Overview Section -->
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="primary" variant="tonal" class="mr-4" size="56">
                      <v-icon icon="mdi-cloud-outline" size="28"></v-icon>
                    </v-avatar>
                    <h2 class="text-h5 font-weight-bold">Overview</h2>
                  </div>
                  <p class="text-body-1">
                    This is a file management system built with Vue.js frontend and Node.js backend.
                    It allows you to securely upload files to our cloud storage and manage them with ease.
                  </p>
                </div>
                
                <!-- Features Section -->
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="success" variant="tonal" class="mr-4" size="56">
                      <v-icon icon="mdi-check-circle-outline" size="28"></v-icon>
                    </v-avatar>
                    <h2 class="text-h5 font-weight-bold">Features</h2>
                  </div>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="success" class="mr-3">mdi-upload</v-icon>
                        <div class="font-weight-medium">Upload various file types</div>
                      </div>
                      <div class="d-flex align-center mb-3">
                        <v-icon color="success" class="mr-3">mdi-file-multiple</v-icon>
                        <div class="font-weight-medium">Support for files up to 100MB</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="success" class="mr-3">mdi-download</v-icon>
                        <div class="font-weight-medium">Easily download your files</div>
                      </div>
                      <div class="d-flex align-center mb-3">
                        <v-icon color="success" class="mr-3">mdi-delete</v-icon>
                        <div class="font-weight-medium">Simple file management</div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                
                <!-- Technology Section -->
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="info" variant="tonal" class="mr-4" size="56">
                      <v-icon icon="mdi-code-tags" size="28"></v-icon>
                    </v-avatar>
                    <h2 class="text-h5 font-weight-bold">Technology</h2>
                  </div>
                  
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-card variant="tonal" class="rounded-lg text-center pa-4" height="100%">
                        <v-icon color="primary" size="36" class="mb-2">mdi-vuejs</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold mb-1">Frontend</h3>
                        <p class="text-caption">Built with Vue.js and Vuetify for a responsive interface</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                      <v-card variant="tonal" class="rounded-lg text-center pa-4" height="100%">
                        <v-icon color="success" size="36" class="mb-2">mdi-nodejs</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold mb-1">Backend</h3>
                        <p class="text-caption">Powered by Express and MongoDB for reliable data storage</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                      <v-card variant="tonal" class="rounded-lg text-center pa-4" height="100%">
                        <v-icon color="info" size="36" class="mb-2">mdi-cloud-upload</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold mb-1">Storage</h3>
                        <p class="text-caption">Integrated with Cloudinary for secure cloud storage</p>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
                
                <!-- Contact Section -->
                <div>
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="warning" variant="tonal" class="mr-4" size="56">
                      <v-icon icon="mdi-help-circle-outline" size="28"></v-icon>
                    </v-avatar>
                    <h2 class="text-h5 font-weight-bold">Need Help?</h2>
                  </div>
                  
                  <p class="text-body-1 mb-4">
                    If you have any questions or need assistance with this application, please don't hesitate to contact us.
                  </p>
                  
                  <v-btn color="primary" variant="elevated" prepend-icon="mdi-email" class="px-6" rounded="lg">
                    Contact Support
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Back to Files Button -->
          <div class="text-center mt-6">
            <v-btn
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-arrow-left"
              to="/"
              class="px-6"
              rounded="lg"
            >
              Back to Files
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about {
  padding: 24px 0;
  min-height: 100vh;
  background-color: var(--v-background);
}

.max-width-500 {
  max-width: 500px;
}

/* Matching the same background style from HomeView */
:deep(.v-application) {
  --v-background: #f8f9fa;
  background-color: var(--v-background);
  background-image: 
    radial-gradient(at 47% 33%, rgba(var(--v-theme-primary), 0.04) 0, transparent 59%), 
    radial-gradient(at 82% 65%, rgba(var(--v-theme-secondary), 0.04) 0, transparent 55%);
  background-attachment: fixed;
}

@media (max-width: 600px) {
  .about {
    padding: 16px 0;
  }
}
</style>