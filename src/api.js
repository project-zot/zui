import axios from 'axios';
import { isEmpty } from 'lodash';
import { sortByCriteria } from 'utilities/sortCriteria';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      return Promise.reject(error);
    }
  }
);

const api = {
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
    }}){Results {Name LastUpdated Size Platforms {Os Arch}  NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description  Licenses Title Source IsSigned Documentation Vendor Labels} DownloadCount}}}`,
  detailedRepoInfo: (name) =>
    `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:"${name}"){Images {Manifests {Digest Platform {Os Arch} Size} Vulnerabilities {MaxSeverity Count} Tag LastUpdated Vendor } Summary {Name LastUpdated Size Platforms {Os Arch} Vendors NewestImage {RepoName IsSigned Vulnerabilities {MaxSeverity Count} Manifests {Digest} Tag Title Documentation DownloadCount Source Description Licenses}}}}`,
  detailedImageInfo: (name, tag) =>
    `/v2/_zot/ext/search?query={Image(image: "${name}:${tag}"){RepoName IsSigned Vulnerabilities {MaxSeverity Count} Tag Manifests {History {Layer {Size Digest} HistoryDescription {CreatedBy EmptyLayer}} Digest ConfigDigest LastUpdated Size  Platform {Os Arch}} Vendor Licenses }}`,
  vulnerabilitiesForRepo: (name, { pageNumber = 1, pageSize = 15 }, searchTerm = '') => {
    let query = `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}`;
    if (!isEmpty(searchTerm)) {
      query += `, searchedCVE: "${searchTerm}"`;
    }
    return `${query}){Tag Page {TotalCount ItemCount} CVEList {Id Title Description Severity PackageList {Name InstalledVersion FixedVersion}}}}`;
  },
  imageListWithCVEFixed: (cveId, repoName, { pageNumber = 1, pageSize = 3 }) =>
    `/v2/_zot/ext/search?query={ImageListWithCVEFixed(id:"${cveId}", image:"${repoName}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}) {Page {TotalCount ItemCount} Results {Tag}}}`,
  dependsOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={BaseImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results { RepoName Tag Description Manifests {Digest Platform {Os Arch} Size} Vendor DownloadCount LastUpdated IsSigned Vulnerabilities {MaxSeverity Count}}}}`,
  isDependentOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={DerivedImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results {RepoName Tag Description Manifests {Digest Platform {Os Arch} Size} Vendor DownloadCount LastUpdated IsSigned Vulnerabilities {MaxSeverity Count}}}}`,
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
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam} ${filterParam}) {Page {TotalCount ItemCount} Repos {Name LastUpdated Size Platforms { Os Arch } NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description IsSigned Licenses Vendor Labels } DownloadCount}}}`;
  },
  imageSuggestions: ({ searchQuery = '""', pageNumber = 1, pageSize = 15 }) => {
    const searchParam = searchQuery !== '' ? `query:"${searchQuery}"` : `query:""`;
    const paginationParam = `requestedPage: {limit:${pageSize} offset:${(pageNumber - 1) * pageSize} sortBy:RELEVANCE}`;
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam}) {Images {RepoName Tag}}}`;
  },
  referrers: ({ repo, digest, type = '' }) =>
    `/v2/_zot/ext/search?query={Referrers(repo: "${repo}" digest: "${digest}" type: "${type}"){MediaType ArtifactType Size Digest Annotations{Key Value}}}`
};

export { api, endpoints };
