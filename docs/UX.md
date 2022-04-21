# Problem Statement

This document describes the user experience requirements for the [`zot`
project](https://github.com/project-zot/zot) and by extension the `zot`'s UI
project called [`zui`](https://github.com/project-zot/zui)

`zot` is a OCI image registry purely based on OCI standards both for the
on-the-wire protocols and the on-disk storage format.

# Use Cases

**U1**: (datapath) User can push and pull container images to the
`zot` registry using standard ecosystem tools.

**U2**: (query) User can query about various properties of
container images stored on the registry. 

For example,
    * list all images
    * list all images under a repository
    * list an interesting property (such as image size or vulnerabilities found) of all images
    * list an interesting property (such as image size or vulnerabilities found) of an images
    * search images explicitly matching an interesting property (such as name, size, vulnerability found, type)
    * free-form search images matching any interesting property (such as name, size, vulnerability found, type)
    * return a chain of build deps (for example an image built with "from A" may in turn depend on "from B", and so on)

**U3**: (configuration) User can configure `zot` registry for the following
cases - a) initial configuration, b) dynamically modify existing
configuration.

**U4**: (authentication) User can authenticate to `zot` via various mechanisms
such as local authentication or remote authentication using LDAP or oauth
bearer tokens (for example GitHub, etc)

**U5**: (metrics) User can observe a running `zot` to watch resource usage such
as CPU, memory, disk usage, per-repository usage and internal metrics such as
query and lock latencies.

**U6**: (faults) Abnormal events are reported to the user.

# Requirements

**R1**: (datapath) `zot` MUST support and be compatible with ecosystem tools
(such as `skopeo` and `oras`) which can push and pull container images to the
`zot` registry. This is already true with the latest version of `zot`.

**R2**: (query) `zot` MUST support queries listed in **U2**.

**R3**: (configuration) For **U3**(a) `zot` MUST support a workflow for initial
configuration via a wizard. For **U3**(b) `zot` MUST support dynamic
configuration management.

**R4**: (authentication) `zot` MUST support and validate required authentication mechanisms.

**R5**: (metrics) `zot` MUST support metrics collection and reporting. `zot`
currently supports these metrics and also does Prometheus integration.

**R6**: (faults) `zot` MUST raise and report abnormal events. Currently, these are reported via logs.
