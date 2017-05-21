#!/usr/bin/env bash

reponame=$1
repodescription=$2


aws codecommit create-repository --repository-name $1 --repository-description $2