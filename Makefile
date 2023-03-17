REGISTRY_HOST ?= localhost
REGISTRY_PORT ?= 8080

.PHONY: all
all: install audit build

.PHONY: install
install:
	npm install --no-audit

.PHONY: build
build:
	npm run build

.PHONY: update
update:
	npm update

.PHONY: audit
audit:
	npm audit --omit=dev

.PHONY: run
run:
	npm start

.PHONY: test-data
test-data:
	./tests/scripts/load_test_data.py \
		--registry $(REGISTRY_HOST):$(REGISTRY_PORT) \
		--data-dir tests/data \
		--config-file tests/data/config.yaml \
		--metadata-file tests/data/image_metadata.json

.PHONY: integration-tests
integration-tests: # Triggering the tests TBD
	cat tests/data/image_metadata.json | jq
