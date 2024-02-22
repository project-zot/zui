const mapToRepo = (responseRepo) => {
  return {
    name: responseRepo.Name,
    latestVersion: responseRepo.NewestImage?.Tag,
    tags: responseRepo.NewestImage?.Labels,
    description: responseRepo.NewestImage?.Description,
    isSigned: responseRepo.NewestImage?.IsSigned,
    signatureInfo: responseRepo.NewestImage?.SignatureInfo?.map((sigInfo) => mapSignatureInfo(sigInfo)),
    isBookmarked: responseRepo.IsBookmarked,
    isStarred: responseRepo.IsStarred,
    platforms: responseRepo.Platforms,
    licenses: responseRepo.NewestImage?.Licenses,
    size: responseRepo.Size,
    vendor: responseRepo.NewestImage?.Vendor,
    logo: responseRepo.NewestImage?.Logo,
    lastUpdated: responseRepo.LastUpdated,
    downloads: responseRepo.DownloadCount,
    stars: responseRepo.StarCount,
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
    stars: responseRepoInfo.Summary?.NewestImage?.StarCount,
    overview: responseRepoInfo.Summary?.NewestImage?.Documentation,
    license: responseRepoInfo.Summary?.NewestImage?.Licenses,
    vulnerabilitySeverity: responseRepoInfo.Summary?.NewestImage?.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseRepoInfo.Summary?.NewestImage?.Vulnerabilities?.Count,
    isSigned: responseRepoInfo.Summary?.NewestImage?.IsSigned,
    signatureInfo: responseRepoInfo.Summary?.NewestImage?.SignatureInfo?.map((sigInfo) => mapSignatureInfo(sigInfo)),
    isBookmarked: responseRepoInfo.Summary?.IsBookmarked,
    isStarred: responseRepoInfo.Summary?.IsStarred,
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
    starCount: responseImage.StarCount,
    lastUpdated: responseImage.LastUpdated,
    description: responseImage.Description,
    isSigned: responseImage.IsSigned,
    signatureInfo: responseImage.SignatureInfo?.map((sigInfo) => mapSignatureInfo(sigInfo)),
    license: responseImage.Licenses,
    labels: responseImage.Labels,
    title: responseImage.Title,
    source: responseImage.Source,
    documentation: responseImage.Documentation,
    vendor: responseImage.Vendor,
    authors: responseImage.Authors,
    vulnerabiltySeverity: responseImage.Vulnerabilities?.MaxSeverity,
    vulnerabilityCount: responseImage.Vulnerabilities?.Count,
    isDeletable: responseImage.IsDeletable,
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
    starCount: responseManifest.StarCount,
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
      description: cve.Description,
      reference: cve.Reference,
      packageList: cve.PackageList?.map((pkg) => ({
        packageName: pkg.Name,
        packagePath: pkg.PackagePath,
        packageInstalledVersion: pkg.InstalledVersion,
        packageFixedVersion: pkg.FixedVersion
      }))
    };
  });
  return cveList;
};

const mapAllCVEInfo = (cveInfo) => {
  const cveList = cveInfo.flatMap((cve) => {
    return cve.PackageList.map((packageInfo) => {
      return {
        id: cve.Id,
        severity: cve.Severity,
        title: cve.Title,
        description: cve.Description,
        reference: cve.Reference,
        packageName: packageInfo.Name,
        packagePath: packageInfo.PackagePath,
        packageInstalledVersion: packageInfo.InstalledVersion,
        packageFixedVersion: packageInfo.FixedVersion
      };
    });
  });
  return cveList;
};

const mapSignatureInfo = (signatureInfo) => {
  return signatureInfo
    ? {
        tool: signatureInfo.Tool,
        isTrusted: signatureInfo.IsTrusted?.toString(),
        author: signatureInfo.Author
      }
    : {
        tool: 'Unknown',
        isTrusted: 'Unknown',
        author: 'Unknown'
      };
};

const mapReferrer = (referrer) => ({
  mediaType: referrer.MediaType,
  artifactType: referrer.ArtifactType,
  size: referrer.Size,
  digest: referrer.Digest,
  annotations: referrer.Annotations?.map((annotation) => ({ key: annotation.Key, value: annotation.Value }))
});

export { mapToRepo, mapToImage, mapToRepoFromRepoInfo, mapCVEInfo, mapAllCVEInfo, mapReferrer, mapToManifest };
