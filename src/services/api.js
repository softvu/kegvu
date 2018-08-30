import axios from 'axios';

export default {
  getPins() {
    return axios.get('/pins');
  },
};