#!/bin/bash

(cd ./server && tsc -w) & (cd ./server nodemon ./dist/main.js & (cd ./dashboard/ && cp -- *.log ~/Desktop)