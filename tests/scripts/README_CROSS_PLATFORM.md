# Cross-Platform Support

The scripts support **Linux**, **macOS**, and **Windows** (via WSL2 or Git Bash).

## Architecture

The scripts use a pure Python modular architecture:

### Main Scripts
- `create_test_data.py` - Main orchestration script that handles argument parsing, prerequisites, metadata, signing, and scanning

### Core Library
- `image_utils.py` - Contains all utility functions:
  - Platform and tool detection
  - Root filesystem creation functions (`create_rootfs_alpine()`, `create_rootfs_debian()`, `create_rootfs_generic()`)
  - Build tool classes (`BuildahTool`, `PodmanTool`, `DockerTool`)
  - Image creation and pushing (`create_and_push_image()`)
  - Metadata processing and JSON handling

The script automatically detects:
- **Platform** (Linux, macOS, Windows)
- **Build tool** (Buildah, Podman, Docker)
- **OS type** (Alpine, Debian/Ubuntu, Generic) from image name/tag

## Platform Detection

The script automatically detects your platform and selects the best available build tool:
- **Podman** (preferred) - Linux, macOS, Windows (Podman Desktop)
- **Docker** (fallback) - All platforms (Docker Desktop)
- **Buildah** (fallback) - Linux, Podman Desktop

## Prerequisites

### Required Tools (all platforms)
- `python3` - Python 3 interpreter
- `regctl` - Registry client
- `skopeo` - Container image tool
- `cosign` - Image signing
- `trivy` - Vulnerability scanning

### Build Tools (at least one required)
- `buildah` OR `podman` OR `docker`

## Installation by Platform

### Linux (Ubuntu/Debian)
```bash
# Install Python 3 (usually pre-installed)
sudo apt-get update && sudo apt-get install -y python3

# Install regctl
curl -L https://github.com/regclient/regclient/releases/latest/download/regctl-linux-amd64 -o /usr/local/bin/regctl
chmod +x /usr/local/bin/regctl

# Install skopeo, buildah, podman (choose one)
sudo apt-get install -y skopeo buildah podman

# Install cosign
wget -O /usr/local/bin/cosign https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
chmod +x /usr/local/bin/cosign

# Install trivy
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install -y trivy
```

### macOS
```bash
# Install via Homebrew
brew install python3
brew install regclient/regclient/regctl
brew install skopeo
brew install cosign
brew install trivy

# Install build tool (choose one)
brew install buildah podman  # Podman Desktop includes buildah
# OR
brew install --cask docker   # Docker Desktop
```

### Windows

#### Option 1: WSL2 (Recommended)
```bash
# Install WSL2 with Ubuntu
wsl --install

# Then follow Linux instructions above
```

#### Option 2: Podman Desktop
1. Download and install [Podman Desktop](https://podman-desktop.io/)
2. Install additional tools via package manager:
   ```powershell
   # Using Chocolatey
   choco install python3
   choco install skopeo
   choco install cosign
   choco install trivy
   
   # Or using Scoop
   scoop install python skopeo cosign trivy
   ```

#### Option 3: Docker Desktop
1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install additional tools (see Podman Desktop instructions above)

#### Option 4: Git Bash
- Works with Docker Desktop
- Install tools via package managers (choco/scoop)
- Script will auto-detect platform

## Usage

The script works the same way on all platforms:

```bash
./tests/scripts/create_test_data.py \
    --registry localhost:8080 \
    --data-dir tests/data \
    --config-file tests/data/config.yaml \
    --metadata-file tests/data/image_metadata.json \
    -d
```

### Command-Line Arguments

- `-r, --registry` - Registry address (default: `localhost:8080`)
- `-u, --username` - Registry username (optional)
- `-p, --password` - Registry password (optional)
- `-c, --cosign-password` - Cosign key password (optional)
- `-d, --debug` - Enable debug logs
- `-f, --config-file` - Config file containing image information (default: `config.yaml`)
- `-m, --metadata-file` - Output file for image metadata (default: `image_metadata.json`)
- `--data-dir` - Directory where image data is stored (default: current directory)
- `--build-tool` - Force a specific build tool: `buildah`, `podman`, or `docker` (optional, auto-detects if not specified)

## Platform-Specific Notes

### macOS
- Python 3 is typically pre-installed or available via Homebrew
- All platform differences handled automatically by Python

### Windows
- Best experience with WSL2
- Git Bash works but may have path limitations
- Podman Desktop or Docker Desktop required
- Python 3 available via Windows Store or package managers

### Linux
- Python 3 usually pre-installed
- Native support for all tools
- Podman recommended for best cross-platform compatibility
- Buildah also available (often included with Podman)
- No special considerations needed

## Troubleshooting

### "No container build tool found"
- Install Docker Desktop, Podman Desktop, or Buildah
- Ensure the tool is in your PATH
- Restart your terminal after installation

### "Missing required tools"
- Check installation instructions above
- Verify tools are in PATH: `which python3 regctl skopeo cosign trivy`
- On Windows, ensure you're using WSL2 or have tools installed

### Permission errors
- On Linux, you may need `sudo` for some operations
- Consider using rootless Podman/Buildah
- Docker Desktop handles permissions automatically

## Build Tool Priority

The script checks for tools in this order:
1. **Podman** - Good cross-platform support, daemonless
2. **Docker** - Universal support, requires Docker Desktop
3. **Buildah** - Best for Linux, included with Podman Desktop

You can see which tool is being used by enabling debug mode (`-d`):
```
Platform: linux
Using build tool: podman
```

You can also force a specific build tool using the `--build-tool` flag:
```bash
./tests/scripts/create_test_data.py --build-tool docker ...
```

## Features

### Multi-Architecture Support
Multi-architecture support is configured in the `config.yaml` file by setting the `multiarch` field to `"all"` for an image. When enabled, the script creates multi-arch manifests for:
- `linux/amd64`
- `linux/arm64`
- `linux/arm/v6`
- `linux/arm/v7`

### OCI Annotations
All OCI annotations are added during the build process (not post-build):
- `org.opencontainers.image.title`
- `org.opencontainers.image.description`
- `org.opencontainers.image.url`
- `org.opencontainers.image.source`
- `org.opencontainers.image.licenses`
- `org.opencontainers.image.vendor`
- `org.opencontainers.image.documentation`

### OS Detection
The script automatically detects the OS type from image name/tag:
- **Alpine**: Images/tags containing "alpine"
- **Ubuntu**: Images/tags containing "ubuntu" (uses Debian rootfs function)
- **Debian**: Images/tags containing "debian", "bullseye", or "slim"
- **Generic**: Fallback for other images

### Image Creation from Scratch
Images are created from scratch with:
- Custom root filesystem
- Embedded package databases (Alpine/Debian) with CVE information
- No DockerHub pulls required
- Compatible metadata format for testing

