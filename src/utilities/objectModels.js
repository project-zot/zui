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
    images: responseRepoInfo.Images?.map((image) => mapToImage(image)) || [],
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
    manifests: responseImage.Manifests?.map((manifest) => mapToManifest(manifest)) || [],
    referrers: responseImage.Referrers,
    size: responseImage.Size,
    downloadCount: responseImage.DownloadCount,
    lastUpdated: responseImage.LastUpdated,
    description: responseImage.Description,
    isSigned: responseImage.IsSigned,
    license: responseImage.Licenses,
    labels: responseImage.Labels,
    title: responseImage.Title,
    source: responseImage.Source,
    documentation: responseImage.Documentation,
    vendor: responseImage.Vendor,
    authors: responseImage.Authors,
    vulnerabiltySeverity: responseImage.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseImage.Vulnerabilities?.Count,
    // frontend only prop to increase interop with Repo objects and code reusability
    name: `${responseImage.RepoName}:${responseImage.Tag}`
  };
};

const mapToManifest = (responseManifest) => {
  return {
    digest: responseManifest.Digest,
    configDigest: responseManifest.ConfigDigest,
    lastUpdated: responseManifest.LastUpdated,
    size: responseManifest.Size,
    platform: responseManifest.Platform,
    downloadCount: responseManifest.DownloadCount,
    layers: responseManifest.Layers,
    history: responseManifest.History,
    vulnerabilities: responseManifest.Vulnerabilities
  };
};

const mapCVEInfo = (cveInfo) => {
  const cveList = cveInfo.map((cve) => {
    return {
      id: cve.Id,
      severity: cve.Severity,
      title: cve.Title,
      description: cve.Description
    };
  });
  return cveList;
};

const mapReferrer = (referrer) => ({
  mediaType: referrer.MediaType,
  artifactType: referrer.ArtifactType,
  size: referrer.Size,
  digest: referrer.Digest,
  annotations: referrer.Annotations?.map((annotation) => ({ key: annotation.Key, value: annotation.Value }))
});

export { mapToRepo, mapToImage, mapToRepoFromRepoInfo, mapCVEInfo, mapReferrer, mapToManifest };
