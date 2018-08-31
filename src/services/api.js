import axios from 'axios';

export default {
  fetchPins() {
    return axios.get('/pins').then(res => res.data);
  },
  updatePin(pin, pulses) {
    return axios.post(`/${pin}`, { pulses });
  },
};