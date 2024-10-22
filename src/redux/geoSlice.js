import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  currentGeo: null,
  history: [],
  error: null,
};

const geoSlice = createSlice({
  name: 'geo',
  initialState,
  reducers: {
    fetchGeoSuccess: (state, action) => {
      state.currentGeo = action.payload;
      state.error = null;
    },
    fetchGeoFailure: (state, action) => {
      state.error = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addHistoryEntry: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const { fetchGeoSuccess, fetchGeoFailure, setHistory, addHistoryEntry } = geoSlice.actions;

export const fetchGeo = (ip) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/geo/${ip}`);
    dispatch(fetchGeoSuccess(response.data));
  } catch (error) {
    dispatch(fetchGeoFailure('Invalid IP address'));
  }
};

export const fetchHistory = () => async (dispatch) => {
  const response = await axios.get('/api/history');
  dispatch(setHistory(response.data));
};

// Action to create a history entry
export const createHistoryEntry = (ip) => async (dispatch) => {
  try {
    const response = await axios.post('/api/history', { ip }); // Adjust the endpoint as necessary
    dispatch(addHistoryEntry(response.data)); // Dispatch the new history entry
  } catch (error) {
    console.error('Error creating history entry:', error);
  }
};

export default geoSlice.reducer;
