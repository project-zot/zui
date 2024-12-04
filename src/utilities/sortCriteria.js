import { DateTime } from 'luxon';

export const sortByCriteria = {
  relevance: {
    value: 'RELEVANCE',
    label: 'sortCriteria.relevance'
  },
  updateTime: {
    value: 'UPDATE_TIME',
    label: 'sortCriteria.recent'
  },
  alphabetic: {
    value: 'ALPHABETIC_ASC',
    label: 'sortCriteria.alphabetical'
  },
  alphabeticDesc: {
    value: 'ALPHABETIC_DSC',
    label: 'sortCriteria.alphabeticalDesc'
  },
  // stars: {
  //   value: 'STARS',
  //   label: 'sortCriteria.mostStarred'
  // },
  downloads: {
    value: 'DOWNLOADS',
    label: 'sortCriteria.mostDownloaded'
  }
};

export const tagsSortByCriteria = {
  updateTimeDesc: {
    value: 'UPDATETIME_DESC',
    label: 'sortCriteria.newest',
    func: (a, b) => {
      return DateTime.fromISO(b.lastUpdated).diff(DateTime.fromISO(a.lastUpdated));
    }
  },
  updateTime: {
    value: 'UPDATETIME',
    label: 'sortCriteria.oldest',
    func: (a, b) => {
      return DateTime.fromISO(a.lastUpdated).diff(DateTime.fromISO(b.lastUpdated));
    }
  },
  alphabetic: {
    value: 'ALPHABETIC',
    label: 'sortCriteria.AZ',
    func: (a, b) => {
      return a.tag?.localeCompare(b.tag);
    }
  },
  alphabeticDesc: {
    value: 'ALPHABETIC_DESC',
    label: 'sortCriteria.ZA',
    func: (a, b) => {
      return b.tag?.localeCompare(a.tag);
    }
  }
};
