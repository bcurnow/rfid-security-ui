#!/usr/bin/make

SHELL := /bin/bash
currentDir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
imageName := $(notdir $(patsubst %/,%,$(dir $(currentDir))))
currentUser := $(shell id -u)
currentGroup := $(shell id -g)

build-docker:
	docker build \
	  --target dev_image \
	  --build-arg USER_ID=${currentUser} \
	  --build-arg GROUP_ID=${currentGroup} \
	  -t ${imageName}:latest  \
	  ${currentDir}

build-docker-prod:
	docker build -t ${imageName}:production ${currentDir}

run-docker:
	docker run -it -p 9090:8080 --mount src="${currentDir}",target=/${imageName},type=bind ${imageName}:latest /bin/bash

dev: run-docker

run:
	npm run serve

clear:
	clear
