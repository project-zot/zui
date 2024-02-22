import axios from 'axios';
import { isEmpty } from 'lodash';
import { sortByCriteria } from 'utilities/sortCriteria';
import { isAuthenticationEnabled, logoutUser } from 'utilities/authUtilities';
import { host } from 'host';

axios.interceptors.request.use((config) => {
  if (config.url.includes(endpoints.authConfig) || !isAuthenticationEnabled()) {
    config.withCredentials = false;
  } else {
    config.headers['X-ZOT-API-CLIENT'] = 'zot-ui';
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      if (window.location.pathname.includes('/login')) return Promise.reject(error);
      logoutUser();
      window.location.replace('/login');
      return Promise.reject(error);
    }
  }
);

const api = {
  getAxiosInstance: () => axios,

  getRequestCfg: () => {
    const authConfig = JSON.parse(localStorage.getItem('authConfig'));
    const genericHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    // withCredentials option must be enabled on cross-origin
    return {
      headers: genericHeaders,
      withCredentials: host() !== window?.location?.origin && authConfig !== null
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

  delete(urli, params, abortSignal, cfg) {
    let config = isEmpty(cfg) ? this.getRequestCfg() : cfg;
    if (!isEmpty(abortSignal) && isEmpty(config.signal)) {
      config = { ...config, signal: abortSignal };
    }
    if (!isEmpty(params)) {
      config = { ...config, params };
    }
    return axios.delete(urli, config);
  }
};

const endpoints = {
  status: `/v2/`,
  authConfig: `/v2/_zot/ext/mgmt`,
  openidAuth: `/zot/auth/login`,
  logout: `/zot/auth/logout`,
  apiKeys: '/zot/auth/apikey',
  deleteImage: (name, tag) => `/v2/${name}/manifests/${tag}`,
  repoList: ({ pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={RepoListWithNewestImage(requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Results {Name LastUpdated Size Platforms {Os Arch}  NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description  Licenses Title Source IsSigned SignatureInfo { Tool IsTrusted Author } Documentation Vendor Labels} IsStarred IsBookmarked StarCount DownloadCount}}}`,
  detailedRepoInfo: (name) =>
    `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:"${name}"){Images {Manifests {Digest Platform {Os Arch} Size} Vulnerabilities {MaxSeverity Count} Tag LastUpdated Vendor IsDeletable } Summary {Name LastUpdated Size Platforms {Os Arch} Vendors IsStarred IsBookmarked NewestImage {RepoName IsSigned SignatureInfo { Tool IsTrusted Author } Vulnerabilities {MaxSeverity Count} Manifests {Digest} Tag Vendor Title Documentation DownloadCount Source Description Licenses}}}}`,
  detailedImageInfo: (name, tag) =>
    `/v2/_zot/ext/search?query={Image(image: "${name}:${tag}"){RepoName IsSigned SignatureInfo { Tool IsTrusted Author } Vulnerabilities {MaxSeverity Count}  Referrers {MediaType ArtifactType Size Digest Annotations{Key Value}} Tag Manifests {History {Layer {Size Digest} HistoryDescription {CreatedBy EmptyLayer}} Digest ConfigDigest LastUpdated Size Platform {Os Arch}} Vendor Licenses }}`,
  vulnerabilitiesForRepo: (
    name,
    { pageNumber = 1, pageSize = 15 },
    searchTerm = '',
    excludedTerm = '',
    severity = ''
  ) => {
    let query = `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}`;
    if (!isEmpty(searchTerm)) {
      query += `, searchedCVE: "${searchTerm}"`;
    }
    if (!isEmpty(excludedTerm)) {
      query += `, excludedCVE: "${excludedTerm}"`;
    }
    if (!isEmpty(severity)) {
      query += `, severity: "${severity}"`;
    }
    return `${query}){Tag Page {TotalCount ItemCount} CVEList {Id Title Description Severity Reference PackageList {Name PackagePath InstalledVersion FixedVersion}} Summary {Count UnknownCount LowCount MediumCount HighCount CriticalCount}}}`;
  },
  allVulnerabilitiesForRepo: (name) =>
    `/v2/_zot/ext/search?query={CVEListForImage(image: "${name}"){Tag Page {TotalCount ItemCount} CVEList {Id Title Description Severity Reference PackageList {Name PackagePath InstalledVersion FixedVersion}}}}`,
  imageListWithCVEFixed: (cveId, repoName, { pageNumber = 1, pageSize = 3 }, filter = {}) => {
    let filterParam = '';
    if (filter.Os || filter.Arch) {
      filterParam = `,filter:{`;
      if (filter.Os) filterParam += ` Os:${!isEmpty(filter.Os) ? `${JSON.stringify(filter.Os)}` : '""'}`;
      if (filter.Arch) filterParam += ` Arch:${!isEmpty(filter.Arch) ? `${JSON.stringify(filter.Arch)}` : '""'}`;
      filterParam += '}';
    }
    return `/v2/_zot/ext/search?query={ImageListWithCVEFixed(id:"${cveId}", image:"${repoName}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}${filterParam}) {Page {TotalCount ItemCount} Results {Tag}}}`;
  },
  dependsOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={BaseImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results { RepoName Tag Description Manifests {Digest Platform {Os Arch} Size} Vendor DownloadCount LastUpdated IsSigned SignatureInfo { Tool IsTrusted Author } Vulnerabilities {MaxSeverity Count}}}}`,
  isDependentOnForImage: (name, { pageNumber = 1, pageSize = 15 } = {}) =>
    `/v2/_zot/ext/search?query={DerivedImageList(image: "${name}", requestedPage: {limit:${pageSize} offset:${
      (pageNumber - 1) * pageSize
    }}){Page {TotalCount ItemCount} Results {RepoName Tag Description Manifests {Digest Platform {Os Arch} Size} Vendor DownloadCount LastUpdated IsSigned SignatureInfo { Tool IsTrusted Author } Vulnerabilities {MaxSeverity Count}}}}`,
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
    if (filter.IsBookmarked) filterParam += ` IsBookmarked: ${filter.IsBookmarked}`;
    if (filter.IsStarred) filterParam += ` IsStarred: ${filter.IsStarred}`;
    filterParam += '}';
    if (Object.keys(filter).length === 0) filterParam = '';
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam} ${filterParam}) {Page {TotalCount ItemCount} Repos {Name LastUpdated Size Platforms { Os Arch } IsStarred IsBookmarked NewestImage { Tag Vulnerabilities {MaxSeverity Count} Description IsSigned SignatureInfo { Tool IsTrusted Author } Licenses Vendor Labels } StarCount DownloadCount}}}`;
  },
  imageSuggestions: ({ searchQuery = '""', pageNumber = 1, pageSize = 15 }) => {
    const searchParam = searchQuery !== '' ? `query:"${searchQuery}"` : `query:""`;
    const paginationParam = `requestedPage: {limit:${pageSize} offset:${(pageNumber - 1) * pageSize} sortBy:RELEVANCE}`;
    return `/v2/_zot/ext/search?query={GlobalSearch(${searchParam}, ${paginationParam}) {Images {RepoName Tag}}}`;
  },
  referrers: ({ repo, digest, type = '' }) =>
    `/v2/_zot/ext/search?query={Referrers(repo: "${repo}" digest: "${digest}" type: "${type}"){MediaType ArtifactType Size Digest Annotations{Key Value}}}`,
  bookmarkToggle: (repo) => `/v2/_zot/ext/userprefs?repo=${repo}&action=toggleBookmark`,
  starToggle: (repo) => `/v2/_zot/ext/userprefs?repo=${repo}&action=toggleStar`
};

export { api, endpoints };
