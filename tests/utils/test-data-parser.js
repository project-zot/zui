// read raw test data and get expected result for different queries
import { isNil } from 'lodash';
import * as rawData from '../data/image_metadata.json';

const rawDataToRepo = ([rawDataRepoKey, rawDataRepoValue]) => {
  if (rawDataRepoKey === 'default') return;
  return {
    repo: rawDataRepoKey,
    tags: Object.entries(rawDataRepoValue).map(([key, value]) => ({
      tag: key,
      title: value['org.opencontainers.image.title'],
      description: value['org.opencontainers.image.description'],
      url: value['org.opencontainers.image.url'],
      source: value['org.opencontainers.image.source'],
      license: value['org.opencontainers.image.licenses'],
      vendor: value['org.opencontainers.image.vendor'],
      documentation: value['org.opencontainers.image.documentation'],
      manifests: value['manifests'],
      cves: value['cves']
    }))
  };
};

const getManifestDependents = (manifestValue, repoName) => {
  const dependents = [];
  Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .forEach((repo) => {
      // if different repo
      repo?.tags.forEach((tag) => {
        if (tag.title !== repoName) {
          Object.values(tag?.manifests).forEach((value) => {
            if (value.layers?.length > manifestValue.layers?.length) {
              if (manifestValue.layers?.every((i) => value.layers?.includes(i))) {
                dependents.push(value);
              }
            }
          });
        }
      });
    });
  return dependents;
};

const getManifestDependencies = (manifestValue, repoName) => {
  const dependencies = [];
  Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .forEach((repo) => {
      repo?.tags.forEach((tag) => {
        // if different repo
        if (tag.title !== repoName) {
          Object.values(tag?.manifests).forEach((value) => {
            if (value.layers?.length < manifestValue.layers?.length) {
              if (value.layers?.every((i) => manifestValue.layers?.includes(i))) {
                dependencies.push(value);
              }
            }
          });
        }
      });
    });
  return dependencies;
};

const getMultiTagRepo = () => {
  const multiTagImage = Object.entries(rawData)
    .find(([, value]) => Object.keys(value).length > 1)
    .filter((e) => !isNil(e));
  return rawDataToRepo(multiTagImage);
};

const getTagWithDependents = (minSize = 0) => {
  const parsedRepoList = Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .filter((e) => !isNil(e));
  let tagsArray = [];
  parsedRepoList.forEach((el) => (tagsArray = tagsArray.concat(el?.tags)));
  for (let tag of tagsArray) {
    if (!isNil(tag)) {
      const tagManifests = Object.values(tag?.manifests);
      const manifestWithDependent = tagManifests.findIndex(
        (manifest) => getManifestDependents(manifest, tag.title).length > minSize
      );
      if (manifestWithDependent !== -1) return tag;
    }
  }
  return null;
};

const getTagWithDependencies = (minSize = 0) => {
  const parsedRepoList = Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .filter((e) => !isNil(e));
  let tagsArray = [];
  parsedRepoList.forEach((el) => (tagsArray = tagsArray.concat(el?.tags)));
  for (let tag of tagsArray) {
    if (!isNil(tag)) {
      const tagManifests = Object.values(tag?.manifests);
      const manifestWithDependencies = tagManifests.findIndex(
        (manifest) => getManifestDependencies(manifest, tag.title).length > minSize
      );
      if (manifestWithDependencies !== -1) return tag;
    }
  }
  return null;
};

const getTagWithVulnerabilities = () => {
  const parsedRepoList = Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .filter((e) => !isNil(e));
  let tagsArray = [];
  parsedRepoList.forEach((el) => (tagsArray = tagsArray.concat(el?.tags)));
  const tagWithCves = tagsArray.find((tag) => Object.keys(tag.cves).length > 0);
  return tagWithCves;
};

const getTagWithMultiarch = () => {
  const parsedRepoList = Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .filter((e) => !isNil(e));
  let tagsArray = [];
  const tagsList = parsedRepoList.forEach((el) => tagsArray.concat(el?.tags));
  const tagWithMultiarch = tagsList.find((tag) => tag.multiarch === 'all');
  return tagWithMultiarch;
};

const getRepoListOrderedAlpha = () => {
  const parsedRepoList = Object.entries(rawData)
    .map((repo) => rawDataToRepo(repo))
    .filter((e) => !isNil(e));
  parsedRepoList.sort((a, b) => a?.repo.localeCompare(b?.repo));
  return parsedRepoList;
};

// Currently image metadata does not contain last update time for tags
// const getLastUpdatedForRepo = (repo) => {
//   const debug = DateTime.max(...repo.tags.map((tag) => DateTime.fromISO(tag.lastUpdated)));
//   return debug;
// };

// const getRepoListOrderedRecent = () => {
//   const parsedRepoList = Object.entries(rawData)
//     .map((repo) => rawDataToRepo(repo))
//     .filter((e) => !isNil(e));
//   parsedRepoList.sort((a, b) => getLastUpdatedForRepo(b).diff(getLastUpdatedForRepo(a)));
//   return parsedRepoList;
// };

const getRepoCardNameForLocator = (repo) => {
  return `${repo?.repo} ${repo?.tags[0]?.description?.slice(0, 10)}`;
};

export {
  getMultiTagRepo,
  getRepoListOrderedAlpha,
  getTagWithDependents,
  getTagWithDependencies,
  getTagWithVulnerabilities,
  getTagWithMultiarch,
  getRepoCardNameForLocator
};
