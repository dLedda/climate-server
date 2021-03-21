#!/bin/bash

(cd ./server && tsc) & (cd ./dashboard && npm run build)