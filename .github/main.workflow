workflow "Build, Test and Deploy" {
  on       = "push"

  resolves = [
    "Build"
  ]
}

action "Install Node 8" {
  uses = "docker://node:8-alpine"
  runs = "yarn"
  args = "install"
}

action "Test Node 8" {
  needs = "Install Node 8"
  uses  = "docker://node:8-alpine"
  runs  = "yarn"
  args  = "test"
}

action "Install Node 10" {
  uses = "docker://node:10-alpine"
  runs = "yarn"
  args = "install"
}

action "Test Node 10" {
  needs = "Install Node 10"
  uses  = "docker://node:10-alpine"
  runs  = "yarn"
  args  = "test"
}

action "Install Node 11" {
  uses = "docker://node:11-alpine"
  runs = "yarn"
  args = "install"
}

action "Test Node 11" {
  needs = "Install Node 11"
  uses  = "docker://node:11-alpine"
  runs  = "yarn"
  args  = "test"
}

action "Install Node 12" {
  uses = "docker://node:12-alpine"
  runs = "yarn"
  args = "install"
}

action "Test Node 12" {
  needs = "Install Node 12"
  uses  = "docker://node:12-alpine"
  runs  = "yarn"
  args  = "test"
}

action "Tag filter" {
  uses  = "actions/bin/filter@master"
  args  = "tag v*"

  needs = [
    "Test Node 12",
    "Test Node 11",
    "Test Node 10",
    "Test Node 8"
  ]
}

action "Build" {
  uses  = "docker://node:lts-alpine"
  needs = "Tag filter"
  runs  = "yarn"
  args  = "build"
}
