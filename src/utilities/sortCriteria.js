import { DateTime } from 'luxon';

export const sortByCriteria = {
  relevance: {
    value: 'RELEVANCE',
    label: 'Relevance'
  },
  updateTime: {
    value: 'UPDATE_TIME',
    label: 'Recent'
  },
  alphabetic: {
    value: 'ALPHABETIC_ASC',
    label: 'Alphabetical'
  },
  alphabeticDesc: {
    value: 'ALPHABETIC_DSC',
    label: 'Alphabetical desc'
  },
  // stars: {
  //   value: 'STARS',
  //   label: 'Most starred'
  // },
  downloads: {
    value: 'DOWNLOADS',
    label: 'Most downloaded'
  }
};

export const tagsSortByCriteria = {
  updateTimeDesc: {
    value: 'UPDATETIME_DESC',
    label: 'Newest',
    func: (a, b) => {
      return DateTime.fromISO(b.LastUpdated).diff(DateTime.fromISO(a.LastUpdated));
    }
  },
  updateTime: {
    value: 'UPDATETIME',
    label: 'Oldest',
    func: (a, b) => {
      return DateTime.fromISO(a.LastUpdated).diff(DateTime.fromISO(b.LastUpdated));
    }
  },
  alphabetic: {
    value: 'ALPHABETIC',
    label: 'A - Z',
    func: (a, b) => {
      return a.Tag?.localeCompare(b.Tag);
    }
  },
  alphabeticDesc: {
    value: 'ALPHABETIC_DESC',
    label: 'Z - A',
    func: (a, b) => {
      return b.Tag?.localeCompare(a.Tag);
    }
  }
};
