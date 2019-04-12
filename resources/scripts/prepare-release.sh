#!/bin/bash

yarn run build
yarn config set version-tag-prefix "v"

version=$(echo $TRAVIS_COMMIT_MESSAGE | sed 's/:construction_worker: bump//' | sed -e 's/  *$//' | sed -e 's/ //g')
if [ -z "$version" ]
then
    version=patch
fi

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

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git add .
git commit -m ':construction_worker: release ready'


git remote add origin-ci https://${GH_TOKEN}@github.com/BastienAr/stream-mock.git > /dev/null 2>&1
git push --tags --quiet --set-upstream origin-ci master 

exit 0