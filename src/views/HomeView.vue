<template>
  <div class="home">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="10" xl="9">
          <!-- Header Section -->
          <div class="text-center mb-6">
            <v-chip color="primary" variant="elevated" class="mb-3 px-3 text-uppercase font-weight-bold">
              <v-icon start>mdi-cloud</v-icon>
              Cloud Storage
            </v-chip>
            <h1 class="text-h3 font-weight-bold mb-2">File Management System</h1>
            <p class="text-body-1 text-medium-emphasis max-width-500 mx-auto">
              Securely upload, manage, and access your files from anywhere. Supports all file types up to 100MB.
            </p>
          </div>
          
          <!-- Stats Cards -->
          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="rounded-lg" variant="outlined" height="100%">
                <v-card-text class="d-flex align-center">
                  <v-avatar color="primary" variant="tonal" class="mr-4" size="56">
                    <v-icon icon="mdi-file-multiple" size="28"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ uploads.length }}</div>
                    <div class="text-caption text-medium-emphasis">Total Files</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card class="rounded-lg" variant="outlined" height="100%">
                <v-card-text class="d-flex align-center">
                  <v-avatar color="success" variant="tonal" class="mr-4" size="56">
                    <v-icon icon="mdi-harddisk" size="28"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ formatStorageSize(totalStorageUsed) }}</div>
                    <div class="text-caption text-medium-emphasis">Storage Used</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card class="rounded-lg" variant="outlined" height="100%">
                <v-card-text class="d-flex align-center">
                  <v-avatar color="info" variant="tonal" class="mr-4" size="56">
                    <v-icon icon="mdi-calendar-check" size="28"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h4 font-weight-bold">{{ lastUploadDate }}</div>
                    <div class="text-caption text-medium-emphasis">Last Upload</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- File Uploader Section -->
          <v-expand-transition>
            <div v-if="showUploader || uploads.length === 0">
              <FileUploader @file-uploaded="handleFileUploaded" />
              
              <div class="text-center my-4" v-if="uploads.length > 0">
                <v-btn
                  variant="text"
                  color="grey"
                  @click="showUploader = false"
                  size="small"
                  class="text-none"
                >
                  <v-icon start>mdi-chevron-up</v-icon>
                  Hide Uploader
                </v-btn>
              </div>
            </div>
          </v-expand-transition>
          
          <v-expand-transition>
            <div v-if="!showUploader && uploads.length > 0" class="text-center mb-4">
              <v-btn
                color="primary"
                variant="elevated"
                @click="showUploader = true"
                size="large"
                class="text-none px-6"
                rounded="lg"
              >
                <v-icon start>mdi-cloud-upload</v-icon>
                Upload New File
              </v-btn>
            </div>
          </v-expand-transition>

          <!-- File List Section -->
          <v-slide-y-transition>
            <FileList
              :uploads="uploads"
              :loading="loading"
              @delete-file="deleteFile"
              @show-uploader="showUploader = true"
            />
          </v-slide-y-transition>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="snackbar.icon"
          start
          class="mr-2"
        ></v-icon>
        {{ snackbar.text }}
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="snackbar.show = false"
        ></v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useUploadStore } from '../store/upload.store'
import FileUploader from '../components/FileUploader.vue'
import FileList from '../components/FileList.vue'

export default {
  name: 'HomeView',
  components: {
    FileUploader,
    FileList
  },
  setup() {
    const uploadStore = useUploadStore()
    const uploads = ref([])
    const loading = ref(false)
    const showUploader = ref(true)
    
    // Snackbar state
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success',
      icon: 'mdi-check-circle'
    })

    // Compute total storage used
    const totalStorageUsed = computed(() => {
      return uploads.value.reduce((total, file) => total + (file.fileSize || 0), 0)
    })
    
    // Get last upload date
    const lastUploadDate = computed(() => {
      if (uploads.value.length === 0) return 'None'
      
      // Find most recent upload
      const dates = uploads.value
        .map(file => new Date(file.uploadDate))
        .sort((a, b) => b - a)
      
      if (dates.length === 0) return 'None'
      
      // Format relative time
      const now = new Date()
      const lastDate = dates[0]
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(lastDate)
    })

    // Format storage size
    const formatStorageSize = (bytes) => {
      if (bytes === 0) return '0 B'
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }
    
    // Fetch all files from the server
    const fetchFiles = async () => {
      loading.value = true
      try {
        await uploadStore.fetchAllUploads()
        uploads.value = uploadStore.getUploads
        
        // Auto-hide uploader if files exist
        if (uploads.value.length > 0) {
          showUploader.value = false
        }
      } catch (error) {
        showNotification('Failed to load files', 'error')
        console.error('Error fetching files:', error)
      } finally {
        loading.value = false
      }
    }
    
    // Handle successful file upload
    const handleFileUploaded = () => {
      fetchFiles()
      showNotification('File uploaded successfully!', 'success')
    }
    
    // Delete a file
    const deleteFile = async (id) => {
      try {
        await uploadStore.deleteFile(id)
        showNotification('File deleted successfully', 'info')
        fetchFiles()
      } catch (error) {
        showNotification('Failed to delete file', 'error')
        console.error('Error deleting file:', error)
      }
    }
    
    // Show notification
    const showNotification = (text, type = 'success') => {
      snackbar.value.text = text
      snackbar.value.show = true
      
      switch (type) {
        case 'success':
          snackbar.value.color = 'success'
          snackbar.value.icon = 'mdi-check-circle'
          break
        case 'error':
          snackbar.value.color = 'error'
          snackbar.value.icon = 'mdi-alert-circle'
          break
        case 'info':
          snackbar.value.color = 'info'
          snackbar.value.icon = 'mdi-information'
          break
        case 'warning':
          snackbar.value.color = 'warning'
          snackbar.value.icon = 'mdi-alert'
          break
      }
    }
    
    onMounted(() => {
      fetchFiles()
    })
    
    return {
      uploads,
      loading,
      handleFileUploaded,
      deleteFile,
      showUploader,
      snackbar,
      totalStorageUsed,
      lastUploadDate,
      formatStorageSize
    }
  }
}
</script>

<style scoped>
.home {
  padding: 24px 0;
  min-height: 100vh;
  background-color: var(--v-background);
}

.max-width-500 {
  max-width: 500px;
}

/* Animated background gradient (optional) */
:deep(.v-application) {
  --v-background: #f8f9fa;
  background-color: var(--v-background);
  background-image: 
    radial-gradient(at 47% 33%, rgba(var(--v-theme-primary), 0.04) 0, transparent 59%), 
    radial-gradient(at 82% 65%, rgba(var(--v-theme-secondary), 0.04) 0, transparent 55%);
  background-attachment: fixed;
}

@media (max-width: 600px) {
  .home {
    padding: 16px 0;
  }
}
</style>