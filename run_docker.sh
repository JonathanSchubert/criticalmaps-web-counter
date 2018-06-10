#!/bin/bash
docker build -t cmaps .
docker run -p 5000:5000 cmaps
