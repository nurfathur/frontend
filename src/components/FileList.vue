<template>
  <div class="file-list">
    <v-card elevation="3" class="rounded-lg" variant="elevated">
      <v-card-item class="bg-primary">
        <v-card-title class="text-h5 font-weight-bold text-white d-flex align-center">
          <v-icon icon="mdi-folder-multiple" class="mr-2" size="large"></v-icon>
          Uploaded Files
        </v-card-title>
        <v-card-subtitle class="text-white text-opacity-70 mt-1">
          {{ uploads.length }} files stored
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="uploads"
          :loading="loading"
          :items-per-page="10"
          hover
          class="file-table"
          v-model:expanded="expanded"
          :footer-props="{
            'items-per-page-options': [5, 10, 20, 50],
            'items-per-page-text': 'Files per page',
            'show-current-page': true,
            'show-first-last-page': true
          }"
        >
          <!-- Loading state -->
          <template v-slot:loader>
            <v-row justify="center" align="center" class="my-6">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <span class="ml-4 text-body-2">Loading your files...</span>
            </v-row>
          </template>

          <!-- File name with icon -->
          <template v-slot:item.fileName="{ item }">
            <div class="d-flex align-center">
              <v-icon 
                :icon="getFileTypeIcon(item.fileType)" 
                :color="getFileTypeColor(item.fileType)"
                class="mr-2"
              ></v-icon>
              <div class="file-name-container">
                <div class="file-name" :title="item.fileName">{{ item.fileName }}</div>
                <div class="file-path text-caption text-disabled" v-if="item.filePath">
                  {{ item.filePath }}
                </div>
              </div>
            </div>
          </template>
          
          <!-- File type with chip -->
          <template v-slot:item.fileType="{ item }">
            <v-chip
              :color="getFileTypeColor(item.fileType)"
              size="small"
              variant="elevated"
              label
              class="px-2"
            >
              {{ getFileTypeLabel(item.fileType) }}
            </v-chip>
          </template>
          
          <!-- File size formatted -->
          <template v-slot:item.fileSize="{ item }">
            <span class="font-weight-medium">{{ formatFileSize(item.fileSize) }}</span>
          </template>
          
          <!-- Date with relative time -->
          <template v-slot:item.uploadDate="{ item }">
            <div class="d-flex flex-column">
              <span class="text-body-2">{{ formatDateShort(item.uploadDate) }}</span>
              <span class="text-caption text-disabled">{{ formatRelativeTime(item.uploadDate) }}</span>
            </div>
          </template>
          
          <!-- Action buttons -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2 justify-center">
              <v-tooltip location="top" text="Preview">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-eye"
                    density="comfortable"
                    variant="tonal"
                    color="info"
                    v-bind="props"
                    size="small"
                    @click="previewFile(item)"
                  ></v-btn>
                </template>
              </v-tooltip>
              
              <v-tooltip location="top" text="Download">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-download"
                    density="comfortable"
                    variant="tonal"
                    color="primary"
                    v-bind="props"
                    size="small"
                    :href="item.url"
                    target="_blank"
                  ></v-btn>
                </template>
              </v-tooltip>
              
              <v-tooltip location="top" text="Delete">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-delete"
                    density="comfortable"
                    variant="tonal"
                    color="error"
                    v-bind="props"
                    size="small"
                    @click="confirmDelete(item)"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
          
          <!-- Empty state -->
          <template v-slot:no-data>
            <div class="empty-state pa-8 text-center">
              <v-icon icon="mdi-cloud-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
              <h3 class="text-h6 font-weight-medium mb-2">No files yet</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Upload your first file to get started
              </p>
              <v-btn 
                color="primary" 
                variant="elevated" 
                prepend-icon="mdi-cloud-upload"
                @click="$emit('show-uploader')"
              >
                Upload Now
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- File Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="800">
      <v-card>
        <v-toolbar color="primary" class="text-white">
          <v-toolbar-title>{{ selectedFile?.fileName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" color="white" @click="previewDialog = false"></v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-4">
          <div class="file-preview-container">
            <!-- Image preview -->
            <div v-if="isImage" class="text-center pa-4">
              <v-img
                :src="selectedFile?.url"
                max-height="500"
                contain
                class="rounded-lg"
              ></v-img>
            </div>
            
            <!-- PDF preview -->
            <div v-else-if="isPdf" class="text-center pa-4">
              <v-alert
                type="info"
                variant="outlined"
                text="PDF preview not available in this view"
                class="mb-4"
              ></v-alert>
              <v-btn
                :href="selectedFile?.url"
                target="_blank"
                color="primary"
                prepend-icon="mdi-open-in-new"
              >
                Open PDF
              </v-btn>
            </div>
            
            <!-- Video preview -->
            <div v-else-if="isVideo" class="text-center pa-4">
              <video
                controls
                style="max-width: 100%; max-height: 500px"
                class="rounded-lg"
              >
                <source :src="selectedFile?.url" :type="selectedFile?.fileType">
                Your browser does not support the video tag.
              </video>
            </div>
            
            <!-- Audio preview -->
            <div v-else-if="isAudio" class="text-center pa-4">
              <audio controls style="width: 100%">
                <source :src="selectedFile?.url" :type="selectedFile?.fileType">
                Your browser does not support the audio element.
              </audio>
            </div>
            
            <!-- Default preview -->
            <div v-else class="text-center py-6">
              <v-icon 
                :icon="getFileTypeIcon(selectedFile?.fileType)" 
                size="96" 
                :color="getFileTypeColor(selectedFile?.fileType)"
                class="mb-4"
              ></v-icon>
              <h3 class="text-h5 mb-2">{{ getFileTypeLabel(selectedFile?.fileType) }} File</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Preview not available for this file type
              </p>
              <v-btn
                :href="selectedFile?.url"
                target="_blank"
                color="primary"
                prepend-icon="mdi-download"
              >
                Download File
              </v-btn>
            </div>
          </div>
          
          <!-- File metadata -->
          <v-divider class="my-4"></v-divider>
          <h3 class="text-subtitle-1 font-weight-bold mb-3">File Information</h3>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="metadata-item">
                <span class="text-caption text-medium-emphasis">File Name</span>
                <span class="text-body-2 font-weight-medium">{{ selectedFile?.fileName }}</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="metadata-item">
                <span class="text-caption text-medium-emphasis">File Type</span>
                <span class="text-body-2 font-weight-medium">{{ selectedFile?.fileType }}</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="metadata-item">
                <span class="text-caption text-medium-emphasis">File Size</span>
                <span class="text-body-2 font-weight-medium">{{ formatFileSize(selectedFile?.fileSize) }}</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="metadata-item">
                <span class="text-caption text-medium-emphasis">Upload Date</span>
                <span class="text-body-2 font-weight-medium">{{ formatDate(selectedFile?.uploadDate) }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-btn
            variant="tonal"
            color="error"
            prepend-icon="mdi-delete"
            @click="deletePreviewedFile"
          >
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-download"
            :href="selectedFile?.url"
            target="_blank"
          >
            Download
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-text class="pt-5">
          <div class="d-flex flex-column align-center mb-4">
            <v-avatar color="error" class="mb-4" size="64">
              <v-icon icon="mdi-alert" size="36" color="white"></v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-2">Delete File</h3>
            <p class="text-body-2 text-center text-medium-emphasis">
              Are you sure you want to delete this file? This action cannot be undone.
            </p>
          </div>
          <div class="file-delete-info pa-3 rounded-lg bg-grey-lighten-4 d-flex align-center">
            <v-icon 
              :icon="getFileTypeIcon(fileToDelete?.fileType)" 
              :color="getFileTypeColor(fileToDelete?.fileType)"
              class="mr-3"
            ></v-icon>
            <div>
              <div class="font-weight-medium">{{ fileToDelete?.fileName }}</div>
              <div class="text-caption">{{ formatFileSize(fileToDelete?.fileSize) }}</div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
            class="text-none"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteFile"
            class="text-none"
          >
            Delete File
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FileList',
  props: {
    uploads: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete-file', 'show-uploader'],
  setup(props, { emit }) {
    // Table setup
    const headers = [
      { 
        title: 'File Name', 
        key: 'fileName', 
        align: 'start',
        sortable: true 
      },
      { 
        title: 'Type', 
        key: 'fileType', 
        sortable: true, 
        width: '120px',
        align: 'center' 
      },
      { 
        title: 'Size', 
        key: 'fileSize', 
        sortable: true, 
        width: '100px',
        align: 'center' 
      },
      { 
        title: 'Upload Date', 
        key: 'uploadDate', 
        sortable: true, 
        width: '180px' 
      },
      { 
        title: 'Actions', 
        key: 'actions', 
        sortable: false, 
        align: 'center', 
        width: '150px' 
      }
    ]
    
    const expanded = ref([])
    
    // File formatting helpers
    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    const formatDateShort = (dateString) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date)
    }
    
    const formatRelativeTime = (dateString) => {
      if (!dateString) return ''
      
      const now = new Date()
      const date = new Date(dateString)
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      
      if (diffMinutes < 1) return 'Just now'
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 30) return `${diffDays} days ago`
      
      return formatDateShort(dateString)
    }
    
    // File type helpers
    const getFileTypeLabel = (mimeType) => {
      if (!mimeType) return 'Unknown'
      
      if (mimeType.startsWith('image/')) return 'Image'
      if (mimeType.startsWith('video/')) return 'Video'
      if (mimeType.startsWith('audio/')) return 'Audio'
      if (mimeType.includes('pdf')) return 'PDF'
      if (mimeType.includes('word') || mimeType.includes('document')) return 'Document'
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheet'
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation'
      if (mimeType.includes('text/')) return 'Text'
      if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'Archive'
      return 'Other'
    }
    
    const getFileTypeColor = (mimeType) => {
      if (!mimeType) return 'grey'
      
      if (mimeType.startsWith('image/')) return 'indigo'
      if (mimeType.startsWith('video/')) return 'deep-purple'
      if (mimeType.startsWith('audio/')) return 'purple'
      if (mimeType.includes('pdf')) return 'red'
      if (mimeType.includes('word') || mimeType.includes('document')) return 'blue'
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'green'
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'amber'
      if (mimeType.includes('text/')) return 'teal'
      if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'brown'
      return 'grey'
    }
    
    const getFileTypeIcon = (mimeType) => {
      if (!mimeType) return 'mdi-file-question'
      
      if (mimeType.startsWith('image/')) return 'mdi-file-image'
      if (mimeType.startsWith('video/')) return 'mdi-file-video'
      if (mimeType.startsWith('audio/')) return 'mdi-file-music'
      if (mimeType.includes('pdf')) return 'mdi-file-pdf-box'
      if (mimeType.includes('word') || mimeType.includes('document')) return 'mdi-file-word'
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'mdi-file-excel'
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'mdi-file-powerpoint'
      if (mimeType.includes('text/')) return 'mdi-file-document'
      if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'mdi-zip-box'
      return 'mdi-file'
    }
    
    // File preview functionality
    const previewDialog = ref(false)
    const selectedFile = ref(null)
    
    const isImage = computed(() => {
      return selectedFile.value?.fileType?.startsWith('image/')
    })
    
    const isPdf = computed(() => {
      return selectedFile.value?.fileType?.includes('pdf')
    })
    
    const isVideo = computed(() => {
      return selectedFile.value?.fileType?.startsWith('video/')
    })
    
    const isAudio = computed(() => {
      return selectedFile.value?.fileType?.startsWith('audio/')
    })
    
    const previewFile = (file) => {
      selectedFile.value = file
      previewDialog.value = true
    }
    
    // Delete functionality
    const deleteDialog = ref(false)
    const fileToDelete = ref(null)
    
    const confirmDelete = (file) => {
      fileToDelete.value = file
      deleteDialog.value = true
    }
    
    const deleteFile = () => {
      emit('delete-file', fileToDelete.value._id)
      deleteDialog.value = false
    }
    
    const deletePreviewedFile = () => {
      emit('delete-file', selectedFile.value._id)
      previewDialog.value = false
    }
    
    return {
      headers,
      expanded,
      formatFileSize,
      formatDate,
      formatDateShort,
      formatRelativeTime,
      getFileTypeLabel,
      getFileTypeColor,
      getFileTypeIcon,
      previewDialog,
      selectedFile,
      isImage,
      isPdf,
      isVideo,
      isAudio,
      previewFile,
      deleteDialog,
      fileToDelete,
      confirmDelete,
      deleteFile,
      deletePreviewedFile
    }
  }
}
</script>

<style scoped>
.file-list {
  margin-bottom: 1.5rem;
}

.file-name-container {
  display: flex;
  flex-direction: column;
}

.file-name {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.file-path {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px 16px !important;
}

:deep(.v-data-table__td) {
  padding: 8px 16px !important;
}

:deep(.v-data-table__th) {
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 0.0375em;
  background-color: rgb(var(--v-theme-surface-variant));
}

:deep(.file-table) {
  border-radius: 0 0 8px 8px;
}
</style>