import { defineStore } from 'pinia'
import { uploadService } from '../services/upload.service'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

export const useUploadStore = defineStore('upload', {
  state: () => ({
    uploads: [],
    loading: false,
    uploading: false,
    error: null
  }),
  
  getters: {
    getUploads: (state) => state.uploads,
    isLoading: (state) => state.loading,
    isUploading: (state) => state.uploading
  },
  
  actions: {
    async fetchAllUploads() {
      this.loading = true
      this.error = null
      
      try {
        const response = await uploadService.getAllUploads()
        this.uploads = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch uploads'
        $toast.error(this.error)
      } finally {
        this.loading = false
      }
    },
    
    async uploadFile(file) {
      this.uploading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await uploadService.uploadFile(formData)
        this.uploads.unshift(response.data)
        $toast.success('File uploaded successfully')
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to upload file'
        $toast.error(this.error)
        throw error
      } finally {
        this.uploading = false
      }
    },
    
    async deleteFile(id) {
      this.loading = true
      this.error = null
      
      try {
        await uploadService.deleteFile(id)
        this.uploads = this.uploads.filter(upload => upload._id !== id)
        $toast.success('File deleted successfully')
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete file'
        $toast.error(this.error)
      } finally {
        this.loading = false
      }
    }
  }
})