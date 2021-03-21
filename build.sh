#!/bin/bash

(cd ./server && tsc -w) & (cd ./dashboard && npm build)