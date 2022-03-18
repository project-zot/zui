.PHONY: all
all: install build

.PHONY: install
install:
	npm install

.PHONY: build
build:
	npm build

.PHONY: update
update:
	npm update

.PHONY: audit
audit:
	npm audit

.PHONY: run
run:
	npm start
