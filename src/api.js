// @ts-nocheck
import axios from 'axios';
import { isEmpty } from 'lodash';

const api = {
  // This method returns the generic request configuration for axios
  getRequestCfg: () => {
    const genericHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('token');
    if (token) {
      const authHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`
      };
      return {
        headers: authHeaders
      };
    }

    return {
      headers: genericHeaders
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
  }
};

const endpoints = {
  repoList:
    '/v2/_zot/ext/search?query={RepoListWithNewestImage(){Name LastUpdated Size Platforms {Os Arch}  NewestImage { Tag  Description  Licenses Title Source Documentation History {Layer {Size Digest} HistoryDescription {Created CreatedBy Author Comment EmptyLayer}} Vendor Labels} DownloadCount}}',
  detailedRepoInfo: (name) =>
    `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:"${name}"){Images {Digest Tag Layers {Size Digest}} Summary {Name LastUpdated Size Platforms {Os Arch} Vendors NewestImage {RepoName Layers {Size Digest} Digest Tag Title Documentation DownloadCount Source Description History {Layer {Size Digest} HistoryDescription {Created CreatedBy Author Comment EmptyLayer}}}}}}`,
  vulnerabilitiesForRepo: (name) =>
    `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}"){Tag, CVEList {Id Title Description Severity PackageList {Name InstalledVersion FixedVersion}}}}`,
  layersDetailsForImage: (name) =>
    `/v2/_zot/ext/search?query={Image(image: "${name}"){History {Layer {Size Digest Score} HistoryDescription {Created CreatedBy Author Comment EmptyLayer} }}}`,
  dependsOnForImage: (name) => `/v2/_zot/ext/search?query={BaseImageList(image: "${name}"){RepoName}}`,
  isDependentOnForImage: (name) => `/v2/_zot/ext/search?query={DerivedImageList(image: "${name}"){RepoName}}`,
  globalSearch: ({ searchQuery = '""', pageNumber = 1, pageSize = 15, filter = {} }) => {
    const searchParam = searchQuery !== '' ? `query:"${searchQuery}"` : `query:""`;
    const paginationParam = `requestedPage: {limit:${pageSize} offset:${(pageNumber - 1) * pageSize}}`;
    let filterParam = `,filter: {`;
    if (filter.Os) filterParam += ` Os:${!isEmpty(filter.Os) ? `"${filter.Os}"` : '""'}`;
    if (filter.Arch) filterParam += ` Arch:${!isEmpty(filter.Arch) ? `"${filter.Arch}"` : '""'}`;
    if (filter.HasToBeSigned) filterParam += ` HasToBeSigned: ${filter.HasToBeSigned}`;
    filterParam += '}';
    if (Object.keys(filter).length === 0) filterParam = '';
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam} ${filterParam}) {Repos {Name LastUpdated Size Platforms { Os Arch } NewestImage { Tag Description Licenses Vendor Labels } DownloadCount}}}`;
  }
};

export { api, endpoints };
