import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
    isConnected: false
  },
  reducers: {
    setConnected(state) {
      state.isConnected = true
    },
    setDisconnected(state) {
      state.isConnected = false
    }
  }
})

export const { setConnected, setDisconnected } = connectionSlice.actions
export default connectionSlice.reducer
