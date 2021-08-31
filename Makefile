#!/usr/bin/make

SHELL := /bin/bash
currentDir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
imageName := $(notdir $(patsubst %/,%,$(dir $(currentDir))))
currentUser := $(shell id -u)
currentGroup := $(shell id -g)

build-docker:
	docker build \
	  --build-arg USER_ID=${currentUser} \
	  --build-arg GROUP_ID=${currentGroup} \
	  -t ${imageName}:latest  \
	  ${currentDir}

run-docker:
	docker run -it -p 8080:8080 --mount src="${currentDir}",target=/${imageName},type=bind ${imageName}:latest /bin/bash

dev: run-docker

run:
	npm run serve

clear:
	clear
