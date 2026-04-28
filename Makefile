REGISTRY_HOST ?= localhost
REGISTRY_PORT ?= 8080
BUILD_TOOL ?=

.PHONY: all
all: install audit build

.PHONY: install
install:
	npm install --no-audit;\
	npx update-browserslist-db@latest

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
		--metadata-file tests/data/image_metadata.json \
		-d

.PHONY: create-test-data
create-test-data:
	./tests/scripts/create_test_data.py \
		--registry $(REGISTRY_HOST):$(REGISTRY_PORT) \
		--data-dir tests/data \
		--config-file tests/data/config.yaml \
		--metadata-file tests/data/image_metadata.json \
		$(if $(BUILD_TOOL),--build-tool $(BUILD_TOOL),) \
		-d

.PHONY: clean-test-data
clean-test-data:
	rm -f tests/data/image_metadata.json
	rm -rf tests/data/images

.PHONY: playwright-browsers
playwright-browsers:
	npx playwright install --with-deps

.PHONY: integration-tests
integration-tests: # Triggering the tests TBD
	UI_HOST=$(REGISTRY_HOST):$(REGISTRY_PORT) API_HOST=$(REGISTRY_HOST):$(REGISTRY_PORT) npm run test:ui
