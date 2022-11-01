const transform = {
  // takes raw # of bytes and decimal value to be returned;
  // returns bytes with nearest human-readable unit
  formatBytes: (bytes) => {
    if (isNaN(bytes)) {
      return '0 Bytes';
    } else if (bytes === 0) {
      return '0 Bytes';
    }

    const DATA_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const k = 1000;

    const unitIdx = Math.floor(Math.log10(bytes) / 3); // log10(1000) = 3
    let value = bytes / Math.pow(k, unitIdx);

    // minimum 2 significant digits

    value = value < 10 ? value.toPrecision(2) : Math.round(value);

    return value + ' ' + DATA_UNITS[unitIdx];
  }
};

export default transform;
