import axios from 'axios'

const API_URL = 'https://backend-upload.up.railway.app/api'

const apiClient = axios.create({
  baseURL: `${API_URL}/uploads`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const uploadService = {
  // Get all uploads
  getAllUploads() {
    return apiClient.get('/')
  },
  
  // Upload a file
  uploadFile(formData) {
    return apiClient.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Delete a file
  deleteFile(id) {
    return apiClient.delete(`/${id}`)
  }
}