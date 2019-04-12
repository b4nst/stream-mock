#!/bin/bash

version=$(echo $TRAVIS_COMMIT_MESSAGE | sed 's/:construction_worker: bump//' | sed -e 's/  *$//' | sed -e 's/ //g')
if [ -z "$version" ]
then
    version=patch
fi

yarn config set version-tag-prefix "v"

case $version in
major)
    yarn version --major
    ;;
minor)
    yarn version --minor
    ;;
patch)
    yarn version --patch
    ;;
*)
    echo "ERROR $version is not in major|minor|patch"
    exit 1
    ;;
esac

exit 0