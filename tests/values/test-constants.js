const hosts = {
  ui: process.env.UI_HOST ? `http://${process.env.UI_HOST}` : 'http://localhost:5000',
  api: process.env.API_HOST ? `http://${process.env.API_HOST}` : 'http://localhost:5000'
};

const sortCriteria = {
  relevance: 'RELEVANCE',
  updateTime: 'UPDATE_TIME',
  alphabetic: 'ALPHABETIC_ASC',
  alphabeticDesc: 'ALPHABETIC_DSC',
  downloads: 'DOWNLOADS'
};

const pageSizes = {
  EXPLORE: 10,
  HOME: 10
};

const endpoints = {
  repoList: `/v2/_zot/ext/search?query={RepoListWithNewestImage(requestedPage:%20{limit:15%20offset:0}){Results%20{Name%20LastUpdated%20Size%20Platforms%20{Os%20Arch}%20%20NewestImage%20{%20Tag%20Vulnerabilities%20{MaxSeverity%20Count}%20Description%20%20Licenses%20Logo%20Title%20Source%20IsSigned%20Documentation%20Vendor%20Labels}%20StarCount%20DownloadCount}}}`,
  detailedRepoInfo: (name) =>
    `/v2/_zot/ext/search?query={ExpandedRepoInfo(repo:%22${name}%22){Images%20{Manifests%20{Digest%20Platform%20{Os%20Arch}%20Size}%20Vulnerabilities%20{MaxSeverity%20Count}%20Tag%20LastUpdated%20Vendor%20IsDeletable%20}%20Summary%20{Name%20LastUpdated%20Size%20Platforms%20{Os%20Arch}%20Vendors%20NewestImage%20{RepoName%20IsSigned%20Vulnerabilities%20{MaxSeverity%20Count}%20Manifests%20{Digest}%20Tag%20Title%20Documentation%20DownloadCount%20Source%20Description%20Licenses}}}}`,
  globalSearch: (searchTerm, sortCriteria, pageNumber = 1, pageSize = 10) =>
    `/v2/_zot/ext/search?query={GlobalSearch(query:%22${searchTerm}%22,%20requestedPage:%20{limit:${pageSize}%20offset:${
      10 * (pageNumber - 1)
    }%20sortBy:%20${sortCriteria}}%20)%20{Page%20{TotalCount%20ItemCount}%20Repos%20{Name%20LastUpdated%20Size%20Platforms%20{%20Os%20Arch%20}%20IsStarred%20IsBookmarked%20NewestImage%20{%20Tag%20Vulnerabilities%20{MaxSeverity%20Count}%20Description%20IsSigned%20SignatureInfo%20{%20Tool%20IsTrusted%20Author%20}%20Licenses%20Vendor%20Labels%20}%20StarCount%20DownloadCount}}}`,
  image: (name) =>
    `/v2/_zot/ext/search?query={Image(image:%20%22${name}%22){RepoName%20IsSigned%20SignatureInfo%20{%20Tool%20IsTrusted%20Author%20}%20Vulnerabilities%20{MaxSeverity%20Count}%20%20Referrers%20{MediaType%20ArtifactType%20Size%20Digest%20Annotations{Key%20Value}}%20Tag%20Manifests%20{History%20{Layer%20{Size%20Digest}%20HistoryDescription%20{CreatedBy%20EmptyLayer}}%20Digest%20ConfigDigest%20LastUpdated%20Size%20Platform%20{Os%20Arch}}%20Vendor%20Licenses%20}}`
};

export { hosts, endpoints, sortCriteria, pageSizes };
