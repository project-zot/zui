import axios from 'axios';
import {isEmpty} from 'lodash';


const api = {
    // This method returns the generic request configuration for axios
    getRequestCfg: () => {
        const genericHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem('token');
        if(token) {
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

const endpoints = {
    imageList: '/v2/_zot/ext/search?query={RepoListWithNewestImage(){ NewestImage {RepoName Tag LastUpdated Description Platform{Os Arch} Licenses Vendor Size Labels} }}',
    detailedRepoInfo: (name) => `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:"${name}"){Images {Digest Tag Layers {Size Digest}} Summary {Name LastUpdated Size Platforms {Os Arch} Vendors NewestImage {Tag}}}}`,
    vulnerabilitiesForRepo: (name) => `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}"){Tag, CVEList {Id Title Description Severity PackageList {Name InstalledVersion FixedVersion}}}}`
}

export {api, endpoints};
