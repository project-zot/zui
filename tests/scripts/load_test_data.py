#!/usr/bin/env python3
import argparse
import json
import logging
import os
import subprocess
import sys
import tempfile
import yaml

def init_logger(debug=False):
    logger = logging.getLogger(__name__)
    if debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    # log format
    log_fmt = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_fmt = "%Y-%m-%d %H:%M:%S"
    formatter = logging.Formatter(log_fmt, date_fmt)
    # create streamHandler and set log fmt
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    # add the streamHandler to logger
    logger.addHandler(stream_handler)
    return logger

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('-r', '--registry', default='localhost:8080', help='Registry address')
    p.add_argument('-u', '--username', default="", help='registry username')
    p.add_argument('-p', '--password', default="", help='registry password')
    p.add_argument('-c', '--cosign-password', default="", help='cosign key password')
    p.add_argument('-d', '--debug', action='store_true', help='enable debug logs')
    p.add_argument('-f', '--config-file', default="config.yaml", help='config file containing information about images to upload')
    p.add_argument('-m', '--metadata-file', default="image_metadata.json", help='file containing metadata on uploaded images')
    p.add_argument('--data-dir', default="", help='location where to store image related data')

    return p.parse_args()

def fetch_tags(logger, image_name):
    cmd = "skopeo list-tags docker://docker.io/{}".format(image_name)
    logger.info("running command: '{}'".format(cmd))

    result = subprocess.run(cmd, capture_output=True, shell=True)
    if result.returncode != 0:
        logger.error("running command `{}` exited with code: {}".format(cmd, str(result.returncode)))
        logger.error(result.stderr)
        sys.exit(1)

    return json.loads(result.stdout)["Tags"]

def pull_modify_push_image(logger, registry, image_name, tag, cosign_password,
                           multiarch, username, password, debug, data_dir):
    logger.info("image '{}:{}' will be processed and pushed".format(image_name, tag))

    image_update_script_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "pull_update_push_image.sh")

    with tempfile.TemporaryDirectory() as meta_dir_name:
        metafile = '{}_{}_metadata.json'.format(image_name, tag)
        metafile = os.path.join(meta_dir_name, metafile)

        cmd = [image_update_script_path, "-r", registry, "-i", image_name, "-t", tag, "-c", cosign_password,
               "-f", metafile, "-m", multiarch, "-u", username, "-p", password, "--data-dir", data_dir]

        if debug:
            cmd.append("-d")

        logger.info("running command: '{}'".format(" ".join(cmd)))
        result = subprocess.run(cmd, stderr=sys.stderr, stdout=sys.stdout)
        if result.returncode != 0:
            logger.error("pushing image `{}:{}` exited with code: ".format(image_name, tag) + str(result.returncode))
            sys.exit(1)

        with open(metafile) as f:
            image_metadata = json.load(f)
            image_metadata[image_name][tag]["multiarch"] = multiarch

    return image_metadata

def main():
    args = parse_args()

    registry = args.registry
    username = args.username
    password = args.password
    cosign_password = args.cosign_password
    config_file = args.config_file
    debug = args.debug
    metadata_file = args.metadata_file
    data_dir= args.data_dir

    logger = init_logger(debug)

    with open(config_file, "r") as f:
        config = yaml.load(f, Loader=yaml.SafeLoader)
 
    metadata = {}

    for image in config["images"]:
        image_name = image["name"]

        multiarch = image["multiarch"]
        if not multiarch:
            multiarch = ""

        actual_tags = fetch_tags(logger, image_name)
        expected_tags = image["tags"]

        logger.debug("image '{}' has the following tags specified in the config file: '{}'".format(image_name, ",".join(expected_tags)))
        logger.debug("image '{}' has the following tags on source registry: '{}'".format(image_name, ",".join(actual_tags)))

        for tag in expected_tags:
            found = False

            for actual_tag in actual_tags:
                if actual_tag == tag:
                    found = True
                    break

            if not found:
                logger.error("image '{}:{}' not found".format(image_name, tag))
                sys.exit(1)

        for tag in expected_tags:
            image_metadata = pull_modify_push_image(logger, registry, image_name, tag, cosign_password, multiarch, username, password, debug, data_dir)

            metadata.setdefault(image_name, {})
            metadata[image_name][tag] = image_metadata[image_name][tag]

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    logger.info("Done loading images, see more details in '{}'".format(metadata_file))

if __name__ == "__main__":
    main()
