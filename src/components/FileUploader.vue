<template>
  <div class="file-uploader">
    <v-card elevation="3" class="rounded-lg" variant="elevated">
      <v-card-item class="bg-primary">
        <v-card-title class="text-h5 font-weight-bold text-white d-flex align-center">
          <v-icon icon="mdi-file-upload-outline" class="mr-2" size="large"></v-icon>
          Upload New File
        </v-card-title>
      </v-card-item>
      
      <v-card-text class="pt-5">
        <div class="upload-dropzone pa-5 rounded-lg text-center d-flex flex-column align-center" 
             :class="{ 'upload-active': isDragging, 'upload-complete': isUploadComplete }"
             @dragover.prevent="isDragging = true"
             @dragleave.prevent="isDragging = false"
             @drop.prevent="handleDrop">
          
          <v-icon :icon="uploadIcon" size="72" :color="uploadIconColor" class="mb-3"></v-icon>
          
          <div class="upload-text mb-3" v-if="!file">
            <div class="text-body-1 font-weight-medium mb-1">Drag files here or click to browse</div>
            <div class="text-body-2 text-medium-emphasis">Accepts all file types (Max 100MB)</div>
          </div>
          
          <div class="selected-file-info d-flex align-center" v-else>
            <v-chip size="large" color="primary" variant="elevated" class="px-3">
              <v-avatar start>
                <v-icon :icon="fileTypeIcon"></v-icon>
              </v-avatar>
              {{ file.name }}
              <template v-slot:append>
                <v-icon @click.stop="removeFile" icon="mdi-close-circle" size="small"></v-icon>
              </template>
            </v-chip>
            <div class="text-caption ml-2 text-medium-emphasis">{{ formattedSize }}</div>
          </div>
          
          <v-file-input
            v-model="file"
            accept="*/*"
            class="hidden-input"
            hide-details
          ></v-file-input>
        </div>
        
        <v-expand-transition>
          <div v-if="uploading" class="mt-6">
            <div class="d-flex align-center mb-1">
              <span class="text-body-2 font-weight-medium">Uploading</span>
              <v-spacer></v-spacer>
              <span class="text-caption">{{ uploadProgress }}%</span>
            </div>
            <v-progress-linear
              :model-value="uploadProgress"
              color="primary"
              height="12"
              rounded
              striped
            ></v-progress-linear>
            <div class="text-caption text-medium-emphasis mt-1">Please don't close this window while uploading</div>
          </div>
        </v-expand-transition>
        
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4">
        <v-btn
          variant="text"
          color="error"
          @click="removeFile"
          v-if="file && !uploading"
        >
          <v-icon start>mdi-delete</v-icon>
          Clear
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          rounded="lg"
          @click="uploadFile"
          :disabled="!file || uploading"
          :loading="uploading"
          class="px-6"
        >
          <v-icon start>mdi-cloud-upload</v-icon>
          Upload File
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUploadStore } from '../store/upload.store'

export default {
  name: 'FileUploader',
  emits: ['file-uploaded'],
  setup(props, { emit }) {
    const uploadStore = useUploadStore()
    const file = ref(null)
    const errorMessage = ref('')
    const isDragging = ref(false)
    const isUploadComplete = ref(false)
    const uploadProgress = ref(0)
    
    const uploading = computed(() => uploadStore.isUploading)
    
    // Calculate formatted size
    const formattedSize = computed(() => {
      if (!file.value) return ''
      
      const size = file.value.size
      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
      return `${(size / (1024 * 1024)).toFixed(1)} MB`
    })
    
    // Determine icon based on file type
    const fileTypeIcon = computed(() => {
      if (!file.value) return 'mdi-file'
      
      const type = file.value.type
      if (type.includes('image')) return 'mdi-file-image'
      if (type.includes('pdf')) return 'mdi-file-pdf'
      if (type.includes('word') || type.includes('document')) return 'mdi-file-word'
      if (type.includes('excel') || type.includes('sheet')) return 'mdi-file-excel'
      if (type.includes('video')) return 'mdi-file-video'
      if (type.includes('audio')) return 'mdi-file-music'
      if (type.includes('zip') || type.includes('compressed')) return 'mdi-zip-box'
      return 'mdi-file'
    })
    
    // Upload icon state
    const uploadIcon = computed(() => {
      if (uploading.value) return 'mdi-upload'
      if (isUploadComplete.value) return 'mdi-check-circle'
      return isDragging.value ? 'mdi-file-move' : 'mdi-cloud-upload'
    })
    
    const uploadIconColor = computed(() => {
      if (isUploadComplete.value) return 'success'
      if (isDragging.value) return 'primary'
      return 'grey-darken-1'
    })
    
    // Handle file drop
    const handleDrop = (event) => {
      isDragging.value = false
      if (event.dataTransfer.files.length) {
        file.value = event.dataTransfer.files[0]
      }
    }
    
    // Remove selected file
    const removeFile = () => {
      file.value = null
      errorMessage.value = ''
    }
    
    const uploadFile = async () => {
      if (!file.value) {
        errorMessage.value = 'Please select a file to upload'
        return
      }
      
      // Check file size (100MB limit)
      if (file.value.size > 100 * 1024 * 1024) {
        errorMessage.value = 'File size exceeds the 100MB limit'
        return
      }
      
      errorMessage.value = ''
      uploadProgress.value = 0
      
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 95) {
          uploadProgress.value += Math.floor(Math.random() * 10)
          if (uploadProgress.value > 95) uploadProgress.value = 95
        }
      }, 300)
      
      try {
        await uploadStore.uploadFile(file.value)
        
        // Complete the progress bar
        uploadProgress.value = 100
        clearInterval(progressInterval)
        
        // Show success state briefly
        isUploadComplete.value = true
        setTimeout(() => {
          isUploadComplete.value = false
          file.value = null
          emit('file-uploaded')
        }, 1500)
      } catch (error) {
        clearInterval(progressInterval)
        console.error('Upload error:', error)
        errorMessage.value = error.message || 'Failed to upload file. Please try again.'
      }
    }
    
    return {
      file,
      errorMessage,
      uploading,
      uploadFile,
      isDragging,
      isUploadComplete,
      handleDrop,
      removeFile,
      fileTypeIcon,
      formattedSize,
      uploadIcon,
      uploadIconColor,
      uploadProgress
    }
  }
}
</script>

<style scoped>
.file-uploader {
  margin-bottom: 1.5rem;
}

.upload-dropzone {
  border: 2px dashed rgb(var(--v-theme-primary), 0.3);
  background-color: rgb(var(--v-theme-primary), 0.05);
  min-height: 170px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.upload-dropzone:hover {
  border-color: rgb(var(--v-theme-primary), 0.5);
  background-color: rgb(var(--v-theme-primary), 0.08);
}

.upload-active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary), 0.12);
  transform: scale(1.01);
}

.upload-complete {
  border-color: rgb(var(--v-theme-success));
  background-color: rgb(var(--v-theme-success), 0.12);
}

.hidden-input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.hidden-input ::v-deep(.v-field__field) {
  display: none;
}
</style>