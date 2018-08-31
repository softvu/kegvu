import axios from 'axios';

export default {
  fetchPins() {
    return axios.get('/pins').then(res => res.data);
  },
};