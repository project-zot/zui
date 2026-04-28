#!/usr/bin/env python3
"""
Utility functions for container image creation.
Handles platform detection, tool detection, OS type detection, and metadata generation.
"""

import base64
import functools
import json
import logging
import os
import platform as platform_module
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import time
import urllib.request
import urllib.error

# Set up logging
logger = logging.getLogger(__name__)


def init_logger(debug=False):
    """Initialize logger with consistent formatting."""
    # Get root logger to configure all loggers
    root_logger = logging.getLogger()

    # Clear any existing handlers to avoid duplicates
    root_logger.handlers.clear()

    # Set level
    if debug:
        root_logger.setLevel(logging.DEBUG)
    else:
        root_logger.setLevel(logging.INFO)

    # Configure log format
    log_fmt = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_fmt = "%Y-%m-%d %H:%M:%S"
    formatter = logging.Formatter(log_fmt, date_fmt)

    # Create stream handler and set formatter
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    # Add handler to root logger (propagates to all loggers)
    root_logger.addHandler(stream_handler)

    return logging.getLogger(__name__)


def configure_registry_tls(registry, logger):
    """Configure regctl TLS settings based on registry URL scheme."""
    if not registry:
        return

    registry_host = registry
    use_https = False

    # Check if registry URL has an explicit scheme
    if registry.startswith("http://"):
        registry_host = registry[7:]
    elif registry.startswith("https://"):
        registry_host = registry[8:]
        use_https = True
    else:
        # No scheme specified, detect using urllib with SSL context that allows self-signed certs
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        # Try HTTPS first (most registries use HTTPS)
        try:
            urllib.request.urlopen(f"https://{registry}/v2/", timeout=2, context=ssl_context)
            use_https = True
        except (urllib.error.URLError, urllib.error.HTTPError):
            try:
                urllib.request.urlopen(f"http://{registry}/v2/", timeout=2)
                use_https = False
            except (urllib.error.URLError, urllib.error.HTTPError):
                # Default to HTTPS for localhost registries (common for test registries)
                if "localhost" in registry or "127.0.0.1" in registry:
                    use_https = True
                else:
                    use_https = False

    # Configure regctl - always use insecure for HTTPS to handle self-signed certs
    if use_https:
        run_command(["regctl", "registry", "set", "--tls", "insecure", registry_host], 
                   capture_output=True, check=True)
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug(f"Configured regctl: HTTPS for {registry_host} (TLS insecure - ignoring certificate errors)")
    else:
        run_command(["regctl", "registry", "set", "--tls", "disabled", registry_host],
                   capture_output=True, check=True)
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug(f"Configured regctl: HTTP for {registry_host} (TLS disabled)")


def verify_prerequisites(data_dir, cosign_key_path, docker_docs_dir, cosign_password, logger, build_tool=None):
    """Verify all required tools are available."""
    missing_tools = []

    required_tools = ["regctl", "skopeo", "cosign", "trivy"]
    for tool in required_tools:
        if not shutil.which(tool):
            missing_tools.append(tool)

    if missing_tools:
        print(f"Error: Missing required tools: {', '.join(missing_tools)}")
        print("")
        print("Installation instructions:")
        print("  Linux:   sudo apt-get install python3 && install tools from their respective repos")
        print("  macOS:   brew install python3 regclient/regclient/regctl skopeo cosign trivy")
        print("  Windows: Use WSL2 or install via package managers (choco/scoop)")
        sys.exit(1)

    # Check for build tool
    if build_tool:
        # Verify the specified build tool is available
        if not shutil.which(build_tool):
            print(f"Error: Specified build tool '{build_tool}' not found!")
            print("")
            print("Please install one of the following:")
            print("  - Buildah (Linux/Podman Desktop): https://buildah.io")
            print("  - Podman (Linux/Podman Desktop): https://podman.io")
            print("  - Docker (all platforms): https://docker.com")
            sys.exit(1)
    else:
        # Auto-detect build tool
        build_tool = detect_build_tool()
        if not build_tool:
            print("Error: No container build tool found!")
            print("")
            print("Please install one of the following:")
            print("  - Buildah (Linux/Podman Desktop): https://buildah.io")
            print("  - Podman (Linux/Podman Desktop): https://podman.io")
            print("  - Docker (all platforms): https://docker.com")
            print("")
            print("Or specify a build tool using --build-tool")
            platform = detect_platform()
            print(f"Platform detected: {platform}")
            sys.exit(1)

    platform = detect_platform()
    if logger.isEnabledFor(logging.DEBUG):
        logger.debug(f"Platform: {platform}")
        logger.debug(f"Using build tool: {build_tool}")

    # Create cosign key if it doesn't exist
    os.makedirs(data_dir, exist_ok=True)
    if not os.path.exists(cosign_key_path):
        env = os.environ.copy()
        # Always set COSIGN_PASSWORD (even if empty) to avoid prompts
        env["COSIGN_PASSWORD"] = cosign_password or ""
        # cosign generate-key-pair uses COSIGN_PASSWORD env var to avoid prompts
        run_command(["cosign", "generate-key-pair"], check=True, env=env)
        key_dir = os.path.dirname(cosign_key_path)
        if os.path.exists("cosign.key"):
            shutil.move("cosign.key", cosign_key_path)
        if os.path.exists("cosign.pub"):
            shutil.move("cosign.pub", os.path.join(key_dir, "cosign.pub"))

    # Clone docker docs repo if needed
    if not os.path.isdir(docker_docs_dir):
        run_command(["git", "clone", "https://github.com/docker-library/docs.git", docker_docs_dir], check=True)


def base64_encode_file(file_path):
    """Cross-platform base64 encoding."""
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')


def sed_inplace(file_path, pattern):
    """Cross-platform sed in-place editing."""
    with open(file_path, "r") as f:
        content = f.read()

    # Simple pattern replacement (s|old|new|g format)
    match = re.match(r's\|([^|]+)\|([^|]+)\|g?', pattern)
    if match:
        old, new = match.groups()
        content = content.replace(old, new)
        with open(file_path, "w") as f:
            f.write(content)
    else:
        # Fallback: use sed if available
        if shutil.which("sed"):
            if sys.platform == "darwin":
                run_command(["sed", "-i", "", pattern, file_path], check=True)
            else:
                run_command(["sed", "-i", pattern, file_path], check=True)


def run_command(cmd, check=True, capture_output=False, text=False, **kwargs):
    """
    Run a shell command with logging.

    Args:
        cmd: Command as list or string
        check: Whether to raise exception on non-zero exit
        capture_output: Whether to capture stdout/stderr
        text: Whether to return text instead of bytes
        **kwargs: Additional arguments to subprocess.run

    Returns:
        subprocess.CompletedProcess result
    """
    if isinstance(cmd, list):
        cmd_str = " ".join(str(arg) for arg in cmd)
    else:
        cmd_str = str(cmd)

    logger.info(f"Running command: {cmd_str}")

    return subprocess.run(cmd, check=check, capture_output=capture_output, text=text, **kwargs)


def detect_platform():
    """Detect the current platform."""
    system = platform_module.system()
    if system == "Linux":
        return "linux"
    elif system == "Darwin":
        return "macos"
    elif system in ("Windows", "CYGWIN_NT", "MSYS_NT", "MINGW32_NT", "MINGW64_NT"):
        return "windows"
    else:
        return "unknown"


def detect_build_tool():
    """Detect available build tool (prefer podman, fallback to docker, then buildah)."""
    if shutil.which("podman"):
        return "podman"
    elif shutil.which("docker"):
        return "docker"
    elif shutil.which("buildah"):
        return "buildah"
    else:
        return None


def parse_platform(platform):
    """
    Parse a platform string into its components.

    Args:
        platform: Platform string (e.g., "linux/amd64", "linux/arm/v6")

    Returns:
        tuple: (os_platform, arch, variant) where variant is None if not present
    """
    parts = platform.split("/")
    os_platform = parts[0]
    arch = parts[1]
    variant = parts[2] if len(parts) > 2 else None
    return os_platform, arch, variant


def detect_os_type(image, tag):
    """Detect OS type from image name and tag."""
    image_lower = image.lower()
    tag_lower = tag.lower()

    if "alpine" in image_lower or "alpine" in tag_lower:
        return "alpine"
    elif "ubuntu" in image_lower or "ubuntu" in tag_lower:
        return "ubuntu"
    elif any(x in image_lower or x in tag_lower for x in ["debian", "bullseye", "slim"]):
        return "debian"
    else:
        return "generic"


def process_trivy_results(trivy_json_string=None, trivy_file_path=None):
    """
    Process Trivy scan results and return structured data.

    Args:
        trivy_json_string: JSON string from Trivy output (preferred)
        trivy_file_path: Path to Trivy JSON output file (fallback)

    Returns:
        dict: Processed Trivy results with 'trivy' key containing Results array
    """
    try:
        if trivy_json_string:
            trivy_data = json.loads(trivy_json_string)
        elif trivy_file_path:
            with open(trivy_file_path, 'r') as f:
                trivy_data = json.load(f)
        else:
            return {"trivy": []}

        # Extract Results array, defaulting to empty array if null or missing
        results = trivy_data.get("Results", [])
        if results is None:
            results = []

        return {"trivy": results}
    except (FileNotFoundError, json.JSONDecodeError, KeyError, ValueError):
        return {"trivy": []}


def get_cve_info(trivy_results):
    """
    Process Trivy results and extract CVE information into a structured format.

    Args:
        trivy_results: List of Trivy result dictionaries from process_trivy_results

    Returns:
        dict: CVE information organized by CVE ID
    """
    cve_dict = {}

    for result in trivy_results:
        for vulnerability in result.get("Vulnerabilities", []):
            cve_id = vulnerability["VulnerabilityID"]

            package = {
                "PackageName": vulnerability.get("PkgName"),
                "InstalledVersion": vulnerability.get("InstalledVersion"),
                "FixedVersion": vulnerability.get("FixedVersion", "Not Specified")
            }

            if cve_dict.get(cve_id):
                cve_dict[cve_id]["PackageList"].append(package)
            else:
                cve_dict[cve_id] = {
                    "ID": cve_id,
                    "Title": vulnerability.get("Title"),
                    "Description": vulnerability.get("Description"),
                    "Severity": vulnerability.get("Severity"),
                    "PackageList": [package]
                }

    return cve_dict


def create_image_details(image, description, repo, license, vendor):
    """
    Create image details JSON with OCI annotations.

    Args:
        image: Image name
        description: Image description
        repo: Repository URL
        license: License information
        vendor: Vendor information

    Returns:
        dict: Image details with OCI annotations
    """
    return {
        "org.opencontainers.image.title": image,
        "org.opencontainers.image.description": f" {description}",
        "org.opencontainers.image.url": repo,
        "org.opencontainers.image.source": repo,
        "org.opencontainers.image.licenses": license,
        "org.opencontainers.image.vendor": vendor,
        "org.opencontainers.image.documentation": description
    }


def extract_layers_from_manifest(regctl_output, platform="default"):
    """
    Extract layer digests from a manifest JSON.

    Args:
        regctl_output: JSON string from regctl manifest get
        platform: Platform identifier (default: "default")

    Returns:
        dict: Manifest structure with layers for the platform
    """
    try:
        manifest_data = json.loads(regctl_output)
        layers = [layer["digest"] for layer in manifest_data.get("layers", [])]
        return {"manifests": {platform: {"layers": layers}}}
    except (json.JSONDecodeError, KeyError):
        return {"manifests": {platform: {"layers": []}}}


def extract_manifests_from_index(regctl_output, oci_ref):
    """
    Extract manifests from a multiarch index and get layers for each platform.

    Args:
        regctl_output: JSON string from regctl manifest get (index)
        oci_ref: OCIReference object for the base image

    Returns:
        dict: Combined manifests structure with layers for each platform
    """
    try:
        index_data = json.loads(regctl_output)
        manifests_list = index_data.get("manifests", [])

        if not manifests_list:
            return {"manifests": {}}

        combined_manifests = {}

        for manifest_ref in manifests_list:
            platform_parts = []
            platform = manifest_ref.get("platform", {})
            if platform.get("os"):
                platform_parts.append(platform["os"])
            if platform.get("architecture"):
                platform_parts.append(platform["architecture"])
            if platform.get("variant"):
                platform_parts.append(platform["variant"])

            platform_id = "/".join(platform_parts)
            digest = manifest_ref["digest"]

            # Get the actual manifest for this platform
            # Use OCIReference.with_digest to create ocidir:// reference with digest
            try:
                ocidir_ref = oci_ref.with_digest(digest)
                result = run_command(
                    ["regctl", "manifest", "--format", "raw-body", "get", ocidir_ref],
                    capture_output=True,
                    text=True,
                    check=True
                )
                manifest_data = json.loads(result.stdout)
                layers = [layer["digest"] for layer in manifest_data.get("layers", [])]
                combined_manifests[platform_id] = {"layers": layers}
            except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
                combined_manifests[platform_id] = {"layers": []}

        return {"manifests": combined_manifests}
    except (json.JSONDecodeError, KeyError):
        return {"manifests": {}}


# Root filesystem creation functions

def _create_base_directories(content_dir, extra_dirs=None):
    """Create base directory structure for root filesystem."""
    base_dirs = ["bin", "usr/bin", "etc", "tmp", "var", "root", "home",
                 "lib", "usr/lib", "usr/local/lib"]
    if extra_dirs:
        base_dirs.extend(extra_dirs)
    for d in base_dirs:
        os.makedirs(os.path.join(content_dir, d), exist_ok=True)


def _create_image_info(content_dir, image, tag, platform=None):
    """Create image-info.txt file with image, tag, and optional platform information."""
    image_info_file = os.path.join(content_dir, "image-info.txt")
    with open(image_info_file, "w") as f:
        f.write(f"image={image}\n")
        f.write(f"tag={tag}\n")
        f.write(f"image_ref={image}:{tag}\n")
        if platform:
            os_platform, arch, variant = parse_platform(platform)
            f.write(f"platform={platform}\n")
            f.write(f"os={os_platform}\n")
            f.write(f"arch={arch}\n")
            if variant:
                f.write(f"variant={variant}\n")


def create_rootfs_alpine(content_dir):
    """Create Alpine Linux root filesystem with package database and CVE information."""
    # Create minimal filesystem structure
    _create_base_directories(content_dir, ["lib/apk/db", "etc/apk"])

    # Create /etc/os-release for Alpine
    with open(os.path.join(content_dir, "etc/os-release"), "w") as f:
        f.write('NAME="Alpine Linux"\n')
        f.write('ID=alpine\n')
        f.write('VERSION_ID=3.14\n')
        f.write('PRETTY_NAME="Alpine Linux 3.14"\n')

    # Create APKINDEX-like entries with vulnerable packages
    installed_db = os.path.join(content_dir, "lib/apk/db/installed")
    with open(installed_db, "w") as f:
        f.write("""P:openssl
V:1.1.1t-r0
A:x86_64
S:1234567
I:123456
T:OpenSSL library
U:https://www.openssl.org/
L:OpenSSL
o:openssl
m:Natanael Copa <ncopa@alpinelinux.org>
t:1234567890
c:MIT
p:so:libcrypto.so.1.1
p:so:libssl.so.1.1
C:CVE-2023-0286 CVE-2022-4304 CVE-2022-4450
F:usr/lib/libcrypto.so.1.1
F:usr/lib/libssl.so.1.1
F:usr/bin/openssl

P:busybox
V:1.35.0-r29
A:x86_64
S:2345678
I:234567
T:BusyBox
U:https://busybox.net/
L:GPLv2
o:busybox
m:Natanael Copa <ncopa@alpinelinux.org>
t:1234567890
c:GPL-2.0-only
C:CVE-2022-28391 CVE-2021-28831
F:bin/busybox
F:bin/sh

P:zlib
V:1.2.12-r3
A:x86_64
S:3456789
I:345678
T:zlib compression library
U:https://zlib.net/
L:zlib
o:zlib
m:Natanael Copa <ncopa@alpinelinux.org>
t:1234567890
c:Zlib
C:CVE-2022-37434
F:usr/lib/libz.so.1
""")

    # Create actual library files so trivy can detect them
    lib_files = [
        "usr/lib/libcrypto.so.1.1",
        "usr/lib/libssl.so.1.1",
        "usr/bin/openssl",
        "bin/busybox",
        "bin/sh",
        "usr/lib/libz.so.1"
    ]
    for lib_file in lib_files:
        lib_path = os.path.join(content_dir, lib_file)
        os.makedirs(os.path.dirname(lib_path), exist_ok=True)
        with open(lib_path, "w"):
            pass


def create_rootfs_debian(content_dir, os_type="debian"):
    """Create Debian/Ubuntu root filesystem with package database and CVE information."""
    # Create minimal filesystem structure
    _create_base_directories(content_dir, [
        "var/lib/dpkg/info", "var/lib/dpkg/status.d", "usr/share/doc",
        "usr/lib/x86_64-linux-gnu", "lib/x86_64-linux-gnu"
    ])

    # Create /etc/os-release
    os_release_path = os.path.join(content_dir, "etc/os-release")
    if os_type == "ubuntu":
        with open(os_release_path, "w") as f:
            f.write('NAME="Ubuntu"\n')
            f.write('VERSION="20.04.5 LTS (Focal Fossa)"\n')
            f.write('ID=ubuntu\n')
            f.write('ID_LIKE=debian\n')
            f.write('PRETTY_NAME="Ubuntu 20.04.5 LTS"\n')
            f.write('VERSION_ID="20.04"\n')
    else:
        with open(os_release_path, "w") as f:
            f.write('PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"\n')
            f.write('NAME="Debian GNU/Linux"\n')
            f.write('VERSION_ID="11"\n')
            f.write('VERSION="11 (bullseye)"\n')
            f.write('ID=debian\n')

    # Create dpkg status file with vulnerable packages
    status_path = os.path.join(content_dir, "var/lib/dpkg/status")
    with open(status_path, "w") as f:
        f.write("""Package: openssl
Status: install ok installed
Priority: important
Section: utils
Installed-Size: 1234
Version: 1.1.1f-1ubuntu2.20
Depends: libc6 (>= 2.14), libssl1.1 (>= 1.1.1)
Description: Secure Sockets Layer toolkit - cryptographic utility
Homepage: https://www.openssl.org/

Package: libssl1.1
Status: install ok installed
Priority: important
Section: libs
Installed-Size: 2345
Version: 1.1.1f-1ubuntu2.20
Depends: libc6 (>= 2.14)
Description: Secure Sockets Layer toolkit - shared libraries
Homepage: https://www.openssl.org/

Package: zlib1g
Status: install ok installed
Priority: required
Section: libs
Installed-Size: 123
Version: 1:1.2.11.dfsg-2ubuntu1.5
Depends: libc6 (>= 2.4)
Description: compression library - runtime
Homepage: http://zlib.net/

Package: libc6
Status: install ok installed
Priority: required
Section: libs
Installed-Size: 12345
Version: 2.31-0ubuntu9.9
Depends: libgcc-s1
Description: GNU C Library: Shared libraries
Homepage: https://www.gnu.org/software/libc/libc.html
""")

    # Create package info files
    pkg_info = {
        "openssl": "/usr/bin/openssl",
        "libssl1.1": "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
        "zlib1g": "/usr/lib/x86_64-linux-gnu/libz.so.1",
        "libc6": "/lib/x86_64-linux-gnu/libc.so.6"
    }
    for pkg, file_path in pkg_info.items():
        list_path = os.path.join(content_dir, f"var/lib/dpkg/info/{pkg}.list")
        with open(list_path, "w") as f:
            f.write(f"{file_path}\n")

    # Create actual library files
    lib_files = [
        "usr/bin/openssl",
        "usr/lib/x86_64-linux-gnu/libssl.so.1.1",
        "usr/lib/x86_64-linux-gnu/libz.so.1",
        "lib/x86_64-linux-gnu/libc.so.6"
    ]
    for lib_file in lib_files:
        lib_path = os.path.join(content_dir, lib_file)
        os.makedirs(os.path.dirname(lib_path), exist_ok=True)
        with open(lib_path, "w"):
            pass


def create_rootfs_generic(content_dir, image, tag):
    """Create minimal root filesystem for generic OS."""
    # Create minimal filesystem structure
    _create_base_directories(content_dir)

    # Create minimal os-release
    with open(os.path.join(content_dir, "etc/os-release"), "w") as f:
        f.write(f'PRETTY_NAME="{image} {tag}"\n')


def create_root_filesystem(content_dir, image, tag, os_type=None, platform=None):
    """
    Create root filesystem based on OS type.

    Args:
        content_dir: Directory to create root filesystem in
        image: Image name
        tag: Image tag
        os_type: OS type (alpine, debian, ubuntu, generic)
        platform: Platform string (e.g., "linux/amd64") to ensure unique content per platform
    """
    if os_type == "alpine":
        create_rootfs_alpine(content_dir)
    elif os_type in ("debian", "ubuntu"):
        create_rootfs_debian(content_dir, os_type)
    else:
        create_rootfs_generic(content_dir, image, tag)

    # Create image-info.txt file with image, tag, and platform information
    _create_image_info(content_dir, image, tag, platform)


# OCI Reference handling

class OCIReference:
    """Class to handle OCI references in different formats."""

    def __init__(self, images_dir, image, tag):
        """
        Initialize OCI reference.

        Args:
            images_dir: Directory where images are stored
            image: Image name
            tag: Image tag
        """
        self.images_dir = images_dir
        self.image = image
        self.tag = tag
        self.image_tag = f"{image}-{tag}"

    def to_skopeo(self):
        """Get skopeo-compliant OCI reference (oci:images_dir:tag)."""
        return f"oci:{self.images_dir}:{self.image_tag}"

    def to_regctl(self, absolute=False):
        """
        Get regctl-compliant OCI reference (ocidir://images_dir:tag).

        Args:
            absolute: If True, use absolute path for images_dir
        """
        if absolute:
            images_dir = os.path.abspath(self.images_dir)
        else:
            images_dir = self.images_dir
        return f"ocidir://{images_dir}:{self.image_tag}"

    def to_trivy(self):
        """Get trivy-compliant reference (images_dir:image-tag)."""
        return f"{self.images_dir}:{self.image_tag}"

    def to_docker(self, registry):
        """Get Docker registry reference (registry/image:tag)."""
        return f"{registry}/{self.image}:{self.tag}"

    def with_digest(self, digest):
        """
        Create a new OCIReference with a digest suffix.

        Args:
            digest: Manifest digest (e.g., "sha256:...")

        Returns:
            String reference with digest (for regctl)
        """
        return f"{self.to_regctl(absolute=True)}@{digest}"


# Decorator and context manager for temporary directory management

class TempDirManager:
    """Context manager for temporary directory management.

    Creates a base temporary directory and provides a method to create platform-specific
    subdirectories. All directories are cleaned up when the context exits.
    """
    def __init__(self):
        self.base_dir = None

    def __enter__(self):
        self.base_dir = tempfile.mkdtemp()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.base_dir:
            shutil.rmtree(self.base_dir, ignore_errors=True)
        return False

    def get_platform_dir(self, platform_id):
        """Get a platform-specific subdirectory within the base temp directory."""
        if not self.base_dir:
            raise RuntimeError("TempDirManager must be used as a context manager")
        platform_dir = os.path.join(self.base_dir, f"platform-{platform_id}")
        os.makedirs(platform_dir, exist_ok=True)
        return platform_dir


def with_temp_dir_manager(func):
    """Decorator that creates a TempDirManager and passes it as temp_mgr.

    The temporary directory manager is automatically cleaned up after the function completes.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        with TempDirManager() as temp_mgr:
            kwargs['temp_mgr'] = temp_mgr
            return func(*args, **kwargs)
    return wrapper


# Build tool classes

class BuildTool:
    """Base class for build tools."""

    def __init__(self, tool_name):
        self.tool_name = tool_name

    def build_single_arch_image(self, build_image_name, oci_ref,
                                annotations=None, os_type=None):
        """Build a single-arch image."""
        raise NotImplementedError

    def build_multiarch_image(self, build_image_name, oci_ref,
                              platforms, annotations=None, os_type=None):
        """
        Build a multiarch image with all platforms.

        Args:
            build_image_name: Base name for build images
            oci_ref: OCIReference object for the final multiarch index
            platforms: List of platform strings (e.g., ["linux/amd64", "linux/arm/v6"])
            annotations: OCI annotations to apply
            os_type: OS type (for root filesystem creation)
        """
        raise NotImplementedError


class BuildahTool(BuildTool):
    """Buildah build tool implementation."""

    def __init__(self):
        super().__init__("buildah")

    @with_temp_dir_manager
    def build_multiarch_image(self, build_image_name, oci_ref,
                              platforms, annotations=None, os_type=None, temp_mgr=None):
        """Build a multiarch image with buildah using native manifest commands.

        Builds each platform, pushes to OCI immediately, then creates manifest list from OCI references.
        """
        manifest_name = f"{build_image_name}-manifest"
        platform_oci_ref_objs = []

        # Build each platform image and push to OCI individually
        for platform in platforms:
            os_platform, arch, variant = parse_platform(platform)

            platform_id = platform.replace("/", "-")
            platform_image = f"{build_image_name}-{platform_id}"
            # Create platform-specific OCI reference
            platform_oci_ref_obj = OCIReference(oci_ref.images_dir, build_image_name, platform_id)
            platform_oci_ref_objs.append(platform_oci_ref_obj)

            # Create platform-specific content directory to ensure unique image IDs
            platform_content_dir = temp_mgr.get_platform_dir(platform_id)

            # Create root filesystem with platform-specific content
            create_root_filesystem(platform_content_dir, oci_ref.image, oci_ref.tag, os_type, platform)

            # Build platform-specific image in buildah storage
            cmd = ["buildah", "from"]
            if variant:
                cmd.extend(["--arch", arch, "--os", os_platform, "--variant", variant, "scratch"])
            else:
                cmd.extend(["--arch", arch, "--os", os_platform, "scratch"])

            result = run_command(cmd, capture_output=True, text=True, check=True)
            container = result.stdout.strip()

            try:
                run_command(["buildah", "copy", container, platform_content_dir, "/"], check=True)

                # Add annotations
                if annotations:
                    for key, value in annotations.items():
                        run_command(["buildah", "config", "--annotation", f"{key}={value}", container], check=True)

                run_command(["buildah", "commit", container, platform_image], check=True)

                # Push to OCI format immediately (avoids manifest add issues)
                platform_oci_ref = platform_oci_ref_obj.to_skopeo()
                run_command(["buildah", "push", platform_image, platform_oci_ref], check=True)
            finally:
                run_command(["buildah", "rm", container], capture_output=True, check=False)
                run_command(["buildah", "rmi", platform_image], capture_output=True, check=False)

        try:
            # Create manifest list with all platform images from OCI
            run_command(["buildah", "manifest", "create", manifest_name], check=True)

            # Add each platform image to manifest with platform annotation
            for i, platform in enumerate(platforms):
                os_platform, arch, variant = parse_platform(platform)

                platform_oci_ref = platform_oci_ref_objs[i].to_skopeo()
                cmd = ["buildah", "manifest", "add", manifest_name, platform_oci_ref]
                if variant:
                    cmd.extend(["--os", os_platform, "--arch", arch, "--variant", variant])
                else:
                    cmd.extend(["--os", os_platform, "--arch", arch])
                run_command(cmd, check=True)

            # Push manifest list to final destination (this will push all images too)
            final_oci_ref_skopeo = oci_ref.to_skopeo()
            run_command(["buildah", "manifest", "push", manifest_name, final_oci_ref_skopeo], check=True)
        finally:
            run_command(["buildah", "manifest", "rm", manifest_name], capture_output=True, check=False)

    @with_temp_dir_manager
    def build_single_arch_image(self, build_image_name, oci_ref,
                                annotations=None, os_type=None, temp_mgr=None):
        """Build a single-arch image with buildah."""
        # Create root filesystem
        create_root_filesystem(temp_mgr.base_dir, oci_ref.image, oci_ref.tag, os_type)

        result = run_command(["buildah", "from", "scratch"], capture_output=True, text=True, check=True)
        container = result.stdout.strip()

        try:
            run_command(["buildah", "copy", container, temp_mgr.base_dir, "/"], check=True)

            # Add annotations
            if annotations:
                for key, value in annotations.items():
                    run_command(["buildah", "config", "--annotation", f"{key}={value}", container], check=True)

            run_command(["buildah", "commit", container, build_image_name], check=True)
            local_image_ref_skopeo = oci_ref.to_skopeo()
            run_command(["buildah", "push", build_image_name, local_image_ref_skopeo], check=True)
        finally:
            run_command(["buildah", "rm", container], capture_output=True, check=False)
            run_command(["buildah", "rmi", build_image_name], capture_output=True, check=False)


class PodmanTool(BuildTool):
    """Podman build tool implementation."""

    def __init__(self):
        super().__init__("podman")

    def _create_dockerfile(self, temp_content_dir):
        """Create a Dockerfile for podman builds."""
        dockerfile_path = os.path.join(temp_content_dir, "Dockerfile")
        with open(dockerfile_path, "w") as f:
            f.write("FROM scratch\n")
            f.write("COPY . /\n")
        return dockerfile_path

    def _add_annotations_to_cmd(self, cmd, annotations):
        """Add annotation flags to a build command."""
        if annotations:
            for key, value in annotations.items():
                cmd.extend(["--annotation", f"{key}={value}"])
        return cmd

    @with_temp_dir_manager
    def build_multiarch_image(self, build_image_name, oci_ref,
                              platforms, annotations=None, os_type=None, temp_mgr=None):
        """Build a multiarch image with podman using native manifest commands.

        Builds each platform, pushes to OCI immediately, then creates manifest list from OCI references.
        """
        manifest_name = f"{build_image_name}-manifest"
        platform_oci_ref_objs = []

        # Build each platform image and push to OCI individually
        for platform in platforms:
            os_platform, arch, variant = parse_platform(platform)

            platform_id = platform.replace("/", "-")
            platform_image = f"{build_image_name}-{platform_id}"
            # Create platform-specific OCI reference
            platform_oci_ref_obj = OCIReference(oci_ref.images_dir, build_image_name, platform_id)
            platform_oci_ref_objs.append(platform_oci_ref_obj)

            # Create platform-specific content directory to ensure unique image IDs
            platform_content_dir = temp_mgr.get_platform_dir(platform_id)

            # Create root filesystem with platform-specific content
            create_root_filesystem(platform_content_dir, oci_ref.image, oci_ref.tag, os_type, platform)

            # Create Dockerfile for this platform
            dockerfile_path = self._create_dockerfile(platform_content_dir)

            # Build platform-specific image in podman storage
            cmd = ["podman", "build", "--platform", platform, "-t", platform_image, "-f", dockerfile_path, platform_content_dir]
            self._add_annotations_to_cmd(cmd, annotations)
            run_command(cmd, check=True)

            # Push to OCI format immediately (avoids manifest add issues)
            platform_oci_ref = platform_oci_ref_obj.to_skopeo()
            run_command(["podman", "push", platform_image, platform_oci_ref], check=True)

            # Clean up the podman image
            run_command(["podman", "rmi", platform_image], capture_output=True, check=False)

        try:
            # Create manifest list with all platform images from OCI
            run_command(["podman", "manifest", "create", manifest_name], check=True)

            # Add each platform image to manifest with platform annotation
            for i, platform in enumerate(platforms):
                os_platform, arch, variant = parse_platform(platform)

                platform_oci_ref = platform_oci_ref_objs[i].to_skopeo()
                cmd = ["podman", "manifest", "add", manifest_name, platform_oci_ref]
                if variant:
                    cmd.extend(["--os", os_platform, "--arch", arch, "--variant", variant])
                else:
                    cmd.extend(["--os", os_platform, "--arch", arch])
                run_command(cmd, check=True)

            # Push manifest list to final destination (this will push all images too)
            final_oci_ref_skopeo = oci_ref.to_skopeo()
            run_command(["podman", "manifest", "push", manifest_name, final_oci_ref_skopeo], check=True)
        finally:
            run_command(["podman", "manifest", "rm", manifest_name], capture_output=True, check=False)

    @with_temp_dir_manager
    def build_single_arch_image(self, build_image_name, oci_ref,
                                annotations=None, os_type=None, temp_mgr=None):
        """Build a single-arch image with podman using only podman commands."""
        # Create root filesystem
        create_root_filesystem(temp_mgr.base_dir, oci_ref.image, oci_ref.tag, os_type)
        dockerfile_path = self._create_dockerfile(temp_mgr.base_dir)
        cmd = ["podman", "build", "-t", build_image_name, "-f", dockerfile_path, temp_mgr.base_dir]
        self._add_annotations_to_cmd(cmd, annotations)
        run_command(cmd, check=True)

        # Push directly to OCI format using podman
        local_image_ref_skopeo = oci_ref.to_skopeo()
        run_command(["podman", "push", build_image_name, local_image_ref_skopeo], check=True)
        run_command(["podman", "rmi", build_image_name], capture_output=True, check=False)


class DockerTool(BuildTool):
    """Docker build tool implementation."""

    def __init__(self):
        super().__init__("docker")

    def _create_dockerfile(self, temp_content_dir):
        """Create a Dockerfile for docker builds."""
        dockerfile_path = os.path.join(temp_content_dir, "Dockerfile")
        with open(dockerfile_path, "w") as f:
            f.write("FROM scratch\n")
            f.write("COPY . /\n")
        return dockerfile_path

    def _add_annotations_to_cmd(self, cmd, annotations):
        """Add annotation flags to a build command."""
        if annotations:
            for key, value in annotations.items():
                cmd.extend(["--annotation", f"{key}={value}"])
        return cmd


    @with_temp_dir_manager
    def build_multiarch_image(self, build_image_name, oci_ref,
                              platforms, annotations=None, os_type=None, temp_mgr=None):
        """Build a multiarch image with docker using buildx.

        Builds each platform separately (since --load doesn't work for multi-platform),
        then creates the multiarch index using regctl.
        """
        platform_oci_ref_objs = []

        # Build each platform separately and load into Docker daemon
        for platform in platforms:
            os_platform, arch, variant = parse_platform(platform)

            platform_id = platform.replace("/", "-")
            # Create platform-specific OCI reference
            platform_oci_ref_obj = OCIReference(oci_ref.images_dir, build_image_name, platform_id)
            platform_oci_ref_objs.append(platform_oci_ref_obj)

            # Create platform-specific content directory to ensure unique image IDs
            platform_content_dir = temp_mgr.get_platform_dir(platform_id)

            # Create root filesystem with platform-specific content
            create_root_filesystem(platform_content_dir, oci_ref.image, oci_ref.tag, os_type, platform)

            # Create Dockerfile for this platform
            dockerfile_path = self._create_dockerfile(platform_content_dir)

            # Build single platform to local Docker daemon (--load works for single platform)
            platform_docker_tag = f"{build_image_name}-{platform_id}:latest"
            cmd = ["docker", "buildx", "build",
                   "--platform", platform,
                   "--output", "type=image,oci-mediatypes=true",
                   "--load",
                   "-t", platform_docker_tag]
            self._add_annotations_to_cmd(cmd, annotations)
            cmd.extend(["-f", dockerfile_path, platform_content_dir])
            run_command(cmd, check=True)

            # Copy from Docker daemon to OCI layout using skopeo
            platform_oci_ref = platform_oci_ref_obj.to_skopeo()
            run_command(["skopeo", "copy", f"docker-daemon:{platform_docker_tag}", platform_oci_ref], check=True)

            # Clean up the Docker image
            run_command(["docker", "rmi", platform_docker_tag], capture_output=True, check=False)

        # Create multiarch index using regctl
        # Get manifest digests for each platform
        platform_digests = []
        for platform_oci_ref_obj in platform_oci_ref_objs:
            # Use OCIReference to construct ocidir:// reference with absolute path
            ocidir_ref = platform_oci_ref_obj.to_regctl(absolute=True)

            # Use regctl to get the manifest digest
            inspect_result = run_command(
                ["regctl", "manifest", "get", ocidir_ref, "--format", "{{.GetDescriptor.Digest}}"],
                capture_output=True, text=True, check=True
            )
            digest = inspect_result.stdout.strip()
            platform_digests.append(digest)

        # Create index with all platforms using regctl
        final_oci_ref_abs = oci_ref.to_regctl(absolute=True)

        # Build index command with --ref for each platform (with digest)
        # regctl will automatically extract platform information from the manifests
        index_cmd = ["regctl", "index", "create", final_oci_ref_abs]
        for i, platform_oci_ref_obj in enumerate(platform_oci_ref_objs):
            # Use OCIReference to create reference with digest
            platform_ref_with_digest = platform_oci_ref_obj.with_digest(platform_digests[i])

            # Add --ref for each platform (regctl extracts platform from manifest)
            index_cmd.extend(["--ref", platform_ref_with_digest])

        run_command(index_cmd, check=True)

    @with_temp_dir_manager
    def build_single_arch_image(self, build_image_name, oci_ref,
                                annotations=None, os_type=None, temp_mgr=None):
        """Build a single-arch image with docker to local daemon, then copy to OCI format."""
        # Create root filesystem
        create_root_filesystem(temp_mgr.base_dir, oci_ref.image, oci_ref.tag, os_type)
        dockerfile_path = self._create_dockerfile(temp_mgr.base_dir)

        # Build to local Docker daemon
        docker_image_tag = f"{build_image_name}:latest"
        cmd = ["docker", "buildx", "build",
               "--output", "type=image,oci-mediatypes=true",
               "--load",
               "-t", docker_image_tag]
        self._add_annotations_to_cmd(cmd, annotations)
        cmd.extend(["-f", dockerfile_path, temp_mgr.base_dir])
        run_command(cmd, check=True)

        # Copy from Docker daemon to OCI layout using skopeo
        final_oci_ref = oci_ref.to_skopeo()
        run_command(["skopeo", "copy", f"docker-daemon:{docker_image_tag}", final_oci_ref], check=True)

        # Clean up the Docker image
        run_command(["docker", "rmi", docker_image_tag], capture_output=True, check=False)


def get_build_tool_instance(tool_name):
    """Get a build tool instance by name."""
    if tool_name == "buildah":
        return BuildahTool()
    elif tool_name == "podman":
        return PodmanTool()
    elif tool_name == "docker":
        return DockerTool()
    else:
        raise ValueError(f"Unknown build tool: {tool_name}")


def create_and_push_image(registry, image, tag, metafile, logger, username="", password="", 
                          cosign_password="", multiarch="", data_dir=None, build_tool=None):
    """
    Create and push a container image from scratch.

    Args:
        registry: Registry address
        image: Image name
        tag: Image tag
        metafile: Path to metadata output file
        logger: Logger instance to use for logging
        username: Registry username (optional)
        password: Registry password (optional)
        cosign_password: Cosign key password (optional)
        multiarch: Multiarch type (e.g., 'all') (optional)
        data_dir: Data directory (defaults to current working directory)
        build_tool: Force a specific build tool (buildah, podman, docker) (optional)

    Returns:
        dict: Image metadata
    """
    if data_dir is None:
        data_dir = os.getcwd()

    # Setup paths
    images_dir = os.path.join(data_dir, "images")
    docker_docs_dir = os.path.join(data_dir, "docs")
    cosign_key_path = os.path.join(data_dir, "cosign.key")

    # Get build tool instance (use forced tool or auto-detect)
    if build_tool:
        build_tool_name = build_tool
    else:
        build_tool_name = detect_build_tool()
        if not build_tool_name:
            logger.error("No build tool found and none specified!")
            sys.exit(1)
    build_tool_instance = get_build_tool_instance(build_tool_name)

    # Read image metadata from docker docs (with fallbacks for missing files)
    image_docs_dir = os.path.join(docker_docs_dir, image)

    # Helper function to read file with default fallback
    def read_file_or_default(file_path, default=""):
        if os.path.exists(file_path):
            try:
                with open(file_path, "r") as f:
                    return f.read().strip()
            except (IOError, OSError):
                return default
        return default

    # Read documentation files with defaults
    repo_file = os.path.join(image_docs_dir, "github-repo")
    repo = read_file_or_default(repo_file, f"https://github.com/docker-library/{image}")

    desc_file = os.path.join(image_docs_dir, "README-short.txt")
    description = read_file_or_default(desc_file, f"{image} container image")

    license_file = os.path.join(image_docs_dir, "license.md")
    license_text = read_file_or_default(license_file, "See repository for license information")

    vendor_file = os.path.join(image_docs_dir, "maintainer.md")
    vendor = read_file_or_default(vendor_file, f"{image} maintainers")

    logo_path = os.path.join(image_docs_dir, "logo.png")
    logo = base64_encode_file(logo_path) if os.path.exists(logo_path) else ""

    # Update maintainer and content files (only if they exist)
    maintainer_path = os.path.join(image_docs_dir, "maintainer.md")
    if os.path.exists(maintainer_path):
        sed_inplace(maintainer_path, f"s|%%GITHUB-REPO%%|{repo}|g")

    content_path = os.path.join(image_docs_dir, "content.md")
    if os.path.exists(content_path):
        sed_inplace(content_path, f"s|%%IMAGE%%|{image}|g")

    # Prepare OCI annotations
    annotations = {
        "org.opencontainers.image.title": image,
        "org.opencontainers.image.description": description,
        "org.opencontainers.image.url": repo,
        "org.opencontainers.image.source": repo,
        "org.opencontainers.image.licenses": license_text,
        "org.opencontainers.image.vendor": vendor,
        "org.opencontainers.image.documentation": description
    }

    # Setup image references using OCIReference class
    oci_ref = OCIReference(images_dir, image, tag)
    local_image_ref_skopeo = oci_ref.to_skopeo()
    local_image_ref_regtl = oci_ref.to_regctl()
    local_image_ref_trivy = oci_ref.to_trivy()
    remote_dest_image_ref = oci_ref.to_docker(registry)

    multiarch_arg = f"--multi-arch={multiarch}" if multiarch else ""

    # Create images directory
    os.makedirs(images_dir, exist_ok=True)

    # Determine OS type
    os_type = detect_os_type(image, tag)

    # Build image
    build_image_name = f"{image}-{tag}-build"

    if multiarch:
        # Multiarch build - builds each platform separately, then creates index
        platforms = ["linux/amd64", "linux/arm64", "linux/arm/v6", "linux/arm/v7"]
        build_tool_instance.build_multiarch_image(
            build_image_name, oci_ref,
            platforms, annotations, os_type
        )
    else:
        # Single-arch build
        build_tool_instance.build_single_arch_image(
            build_image_name, oci_ref, annotations, os_type
        )

    # Upload image to registry
    credentials_args = []
    if username:
        credentials_args = ["--dest-creds", f"{username}:{password}"]

    skopeo_cmd = ["skopeo", "--override-os=linux", "--override-arch=amd64", "copy",
                  "--dest-tls-verify=false"] + ([multiarch_arg] if multiarch_arg else []) + \
                  credentials_args + [local_image_ref_skopeo, f"docker://{remote_dest_image_ref}"]
    run_command(skopeo_cmd, check=True)

    # Wait for registry to process manifest
    time.sleep(1)

    # Upload logo artifact (optional - skip if registry doesn't support it)
    if logo:
        try:
            logo_input = logo.encode('utf-8')
            cmd = ["regctl", "artifact", "put",
                   "--annotation", "artifact.type=com.zot.logo.image",
                   "--annotation", "format=oci",
                   "--artifact-type", "application/vnd.zot.logo.v1",
                   "--subject", remote_dest_image_ref,
                   f"{remote_dest_image_ref}-logo-image"]
            logger.info(f"Running command: {' '.join(cmd)}")
            proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
            stdout, stderr = proc.communicate(input=logo_input)
            if proc.returncode != 0:
                error_msg = stderr.decode('utf-8', errors='ignore').strip()
                logger.debug(f"Failed to upload logo artifact (non-critical): {error_msg}")
        except Exception as e:
            logger.debug(f"Exception during logo upload (non-critical): {e}")

    # Run Trivy scan
    if multiarch:
        result = run_command(
            ["trivy", "image", "--scanners", "vuln",
             "--db-repository", "ghcr.io/project-zot/trivy-db",
             "--format", "json", "--input", local_image_ref_trivy],
            capture_output=True,
            text=True,
            check=False
        )
        trivy_data = process_trivy_results(trivy_json_string=result.stdout)
    else:
        trivy_data = {"trivy": []}

    # Extract layer information
    result = run_command(
        ["regctl", "manifest", "--format", "raw-body", "get", local_image_ref_regtl],
        capture_output=True, text=True, check=True
    )
    if multiarch:
        layers_data = extract_manifests_from_index(result.stdout, oci_ref)
        if not layers_data.get("manifests"):
            logger.error(f"Failed to extract manifests from multiarch index for {image}:{tag}")
            sys.exit(1)
    else:
        layers_data = extract_layers_from_manifest(result.stdout)

    # Sign image
    env = os.environ.copy()
    # Always set COSIGN_PASSWORD (even if empty) to avoid prompts
    env["COSIGN_PASSWORD"] = cosign_password or ""
    run_command(
        ["cosign", "sign", remote_dest_image_ref,
         "--key", cosign_key_path, "--allow-insecure-registry", "--yes"],
        check=True, env=env
    )

    # Generate final metadata
    metadata = create_image_details(image, description, repo, license_text, vendor)
    metadata.update(trivy_data)
    metadata.update(layers_data)

    with open(metafile, "w") as f:
        json.dump(metadata, f, indent=2)

    return metadata


if __name__ == "__main__":
    # Allow testing individual functions
    if len(sys.argv) > 1:
        if sys.argv[1] == "detect_platform":
            print(detect_platform())
        elif sys.argv[1] == "detect_build_tool":
            tool = detect_build_tool()
            print(tool if tool else "")
        elif sys.argv[1] == "detect_os_type" and len(sys.argv) == 4:
            print(detect_os_type(sys.argv[2], sys.argv[3]))

