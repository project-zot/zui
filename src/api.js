import axios from 'axios';
import {isEmpty} from 'lodash';


const api = {
    // This method returns the generic request configuration for axios
    getRequestCfg: () => {
        const genericHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        const username = localStorage.getItem('username');
        if(username) {
            const password = localStorage.getItem('password');
            const token = btoa(username + ':' + password);
            const authHeaders = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
            };
            return {
                headers: authHeaders
            };
        }

        return {
            headers: genericHeaders,
        };
    },

    get(urli, cfg) {
        if (isEmpty(cfg)) {
            return axios.get(urli, this.getRequestCfg());
        } else {
            return axios.get(urli, cfg);
        }
    },

    // This method creates the POST request with axios
    // If caller specifies the request configuration to be sent (@param cfg), it adds it to the request
    // If caller doesn't specfiy the request configuration, it adds the default config to the request
    // This allows caller to pass in any desired request configuration, based on the specifc need
    post(urli, payload, cfg) {
        // generic post - generate config for request
        if (isEmpty(cfg)) {
            return axios.post(urli, payload, this.getRequestCfg());
        // custom post - use passed in config
        // TODO:: validate config object before sending request
        } else {
            return axios.post(urli, payload, cfg);
        }
    },

    put(urli, payload) {
        return axios.put(urli, payload, this.getRequestCfg());
    },

    delete(urli, cfg) {
        let requestCfg = isEmpty(cfg) ? this.getRequestCfg() : cfg;
        return axios.delete(urli, requestCfg);
    },

};

export default api;
