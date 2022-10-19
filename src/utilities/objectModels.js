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
    downloads: responseRepo.DownloadCount
  };
};

const mapToImage = (responseImage) => {
  return {
    repoName: responseImage.RepoName,
    tag: responseImage.Tag,
    // frontend only prop to increase interop with Repo objects and code reusability
    name: `${responseImage.RepoName}:${responseImage.Tag}`,
    logo: responseImage.Logo
  };
};

export { mapToRepo, mapToImage };
