const mapToRepo = (responseRepo) => {
  return {
    name: responseRepo.Name,
    latestVersion: responseRepo.NewestImage?.Tag,
    tags: responseRepo.NewestImage?.Labels,
    description: responseRepo.NewestImage?.Description,
    isSigned: responseRepo.NewestImage?.IsSigned,
    platforms: responseRepo.Platforms,
    licenses: responseRepo.NewestImage?.Licenses,
    size: responseRepo.Size,
    vendor: responseRepo.NewestImage?.Vendor,
    logo: responseRepo.NewestImage?.Logo,
    lastUpdated: responseRepo.LastUpdated,
    downloads: responseRepo.DownloadCount,
    vulnerabiltySeverity: responseRepo.NewestImage?.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseRepo.NewestImage?.Vulnerabilities?.Count
  };
};

const mapToRepoFromRepoInfo = (responseRepoInfo) => {
  return {
    name: responseRepoInfo.Summary?.Name,
    images: responseRepoInfo.Images,
    lastUpdated: responseRepoInfo.Summary?.LastUpdated,
    size: responseRepoInfo.Summary?.Size,
    platforms: responseRepoInfo.Summary?.Platforms,
    vendors: responseRepoInfo.Summary?.Vendors,
    newestTag: responseRepoInfo.Summary?.NewestImage,
    description: responseRepoInfo.Summary?.NewestImage?.Description,
    title: responseRepoInfo.Summary?.NewestImage?.Title,
    source: responseRepoInfo.Summary?.NewestImage?.Source,
    downloads: responseRepoInfo.Summary?.NewestImage?.DownloadCount,
    overview: responseRepoInfo.Summary?.NewestImage?.Documentation,
    license: responseRepoInfo.Summary?.NewestImage?.Licenses,
    vulnerabiltySeverity: responseRepoInfo.Summary?.NewestImage?.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseRepoInfo.Summary?.NewestImage?.Vulnerabilities?.Count,
    isSigned: responseRepoInfo.Summary?.NewestImage?.IsSigned,
    logo: responseRepoInfo.Summary?.NewestImage?.Logo
  };
};

const mapToImage = (responseImage) => {
  return {
    repoName: responseImage.RepoName,
    tag: responseImage.Tag,
    lastUpdated: responseImage.LastUpdated,
    size: responseImage.Size,
    digest: responseImage.ConfigDigest,
    platform: responseImage.Platform,
    vendor: responseImage.Vendor,
    history: responseImage.History,
    license: responseImage.Licenses,
    vulnerabiltySeverity: responseImage.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseImage.Vulnerabilities?.Count,
    isSigned: responseImage.IsSigned,
    logo: responseImage.Logo,
    // frontend only prop to increase interop with Repo objects and code reusability
    name: `${responseImage.RepoName}:${responseImage.Tag}`
  };
};

const mapCVEInfo = (cveInfo) => {
  const cveList = cveInfo.CVEList?.map((cve) => {
    return {
      id: cve.Id,
      severity: cve.Severity,
      title: cve.Title,
      description: cve.Description
    };
  });
  return {
    cveList
  };
};

export { mapToRepo, mapToImage, mapToRepoFromRepoInfo, mapCVEInfo };
