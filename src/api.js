import axios from 'axios';
import { isEmpty } from 'lodash';
import { sortByCriteria } from 'utilities/sortCriteria';

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

  get(urli, abortSignal, cfg) {
    let config = isEmpty(cfg) ? this.getRequestCfg() : cfg;
    if (!isEmpty(abortSignal) && isEmpty(config.signal)) {
      config = { ...config, signal: abortSignal };
    }
    return axios.get(urli, config);
  },

  post(urli, payload, abortSignal, cfg) {
    let config = isEmpty(cfg) ? this.getRequestCfg() : cfg;
    if (!isEmpty(abortSignal) && isEmpty(config.signal)) {
      config = { ...config, signal: abortSignal };
    }
    return axios.post(urli, payload, config);
  },

  put(urli, payload, abortSignal, cfg) {
    let config = isEmpty(cfg) ? this.getRequestCfg() : cfg;
    if (!isEmpty(abortSignal) && isEmpty(config.signal)) {
      config = { ...config, signal: abortSignal };
    }
    return axios.put(urli, payload, config);
  },

  delete(urli, abortSignal, cfg) {
    let config = isEmpty(cfg) ? this.getRequestCfg() : cfg;
    if (!isEmpty(abortSignal) && isEmpty(config.signal)) {
      config = { ...config, signal: abortSignal };
    }
    return axios.delete(urli, config);
  }
};

const endpoints = {
  repoList: ({ pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={RepoListWithNewestImage(requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Results {Name LastUpdated Size Platforms {Os Arch}  NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description  Licenses Logo Title Source IsSigned Documentation Vendor Labels} DownloadCount}}}`,
  detailedRepoInfo: (name) =>
    `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:"${name}"){Images {Digest Vulnerabilities {MaxSeverity Count} Tag LastUpdated Vendor Size Platform {Os Arch}} Summary {Name LastUpdated Size Platforms {Os Arch} Vendors NewestImage {RepoName IsSigned Vulnerabilities {MaxSeverity Count} Layers {Size Digest} Digest Tag Logo Title Documentation DownloadCount Source Description Licenses History {Layer {Size Digest} HistoryDescription {Created CreatedBy Author Comment EmptyLayer}}}}}}`,
  detailedImageInfo: (name, tag) =>
    `/v2/_zot/ext/search?query={Image(image: "${name}:${tag}"){RepoName IsSigned Vulnerabilities {MaxSeverity Count} Tag Digest LastUpdated Size ConfigDigest Platform {Os Arch} Vendor Licenses Logo}}`,
  vulnerabilitiesForRepo: (name) =>
    `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}"){Tag, CVEList {Id Title Description Severity PackageList {Name InstalledVersion FixedVersion}}}}`,
  layersDetailsForImage: (name) =>
    `/v2/_zot/ext/search?query={Image(image: "${name}"){History {Layer {Size Digest Score} HistoryDescription {Created CreatedBy Author Comment EmptyLayer} }}}`,
  imageListWithCVEFixed: (cveId, repoName) =>
    `/v2/_zot/ext/search?query={ImageListWithCVEFixed(id:"${cveId}", image:"${repoName}") {Tag}}`,
  dependsOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={BaseImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results { RepoName Tag Description Digest Vendor DownloadCount LastUpdated Size Platform {Os Arch} IsSigned Vulnerabilities {MaxSeverity Count}}}}`,
  isDependentOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={DerivedImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results {RepoName Tag Description Digest Vendor DownloadCount LastUpdated Size Platform {Os Arch} IsSigned Vulnerabilities {MaxSeverity Count}}}}`,
  globalSearch: ({
    searchQuery = '""',
    pageNumber = 1,
    pageSize = 15,
    sortBy = sortByCriteria.relevance.value,
    filter = {}
  }) => {
    const searchParam = !isEmpty(searchQuery) ? `query:"${searchQuery}"` : `query:""`;
    const paginationParam = `requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    } sortBy: ${sortBy}}`;
    let filterParam = `,filter: {`;
    if (filter.Os) filterParam += ` Os:${!isEmpty(filter.Os) ? `${JSON.stringify(filter.Os)}` : '""'}`;
    if (filter.Arch) filterParam += ` Arch:${!isEmpty(filter.Arch) ? `${JSON.stringify(filter.Arch)}` : '""'}`;
    if (filter.HasToBeSigned) filterParam += ` HasToBeSigned: ${filter.HasToBeSigned}`;
    filterParam += '}';
    if (Object.keys(filter).length === 0) filterParam = '';
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam} ${filterParam}) {Page {TotalCount ItemCount} Repos {Name LastUpdated Size Platforms { Os Arch } NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description IsSigned Logo Licenses Vendor Labels } DownloadCount}}}`;
  },
  imageSuggestions: ({ searchQuery = '""', pageNumber = 1, pageSize = 15 }) => {
    const searchParam = searchQuery !== '' ? `query:"${searchQuery}"` : `query:""`;
    const paginationParam = `requestedPage: {limit:${pageSize} offset:${(pageNumber - 1) * pageSize} sortBy:RELEVANCE}`;
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam}) {Images {RepoName Tag Logo}}}`;
  }
};

export { api, endpoints };
