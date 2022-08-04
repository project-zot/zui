const hostConfig = {
  auto:false, 
  default:'http://localhost:5000'
}

const host = (manualHost = null) => {
  if (hostConfig.auto) {
    return window.location.origin;
  } else if (manualHost) {
    return manualHost;
  }
  return hostConfig.default;
}

export {host};
