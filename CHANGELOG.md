# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.5] - 2019-07-01
### Changed
- travis config to deploy

## [2.0.4] - 2019-07-01
### Added
- This changelog file
- Tests
- Link to generate types in package.json /[@RAnders00](https://github.com/RAnders00)

### Removed
- `_writev` method as pushing to an array is always sequential
- some duplicate code with super constructors (settings encoding, objecMode, etc...)

## [2.0.3] - 2019-06-27
### Added
- Node.js 12.x.x now tests in CI

### Fixed
- Stop using \[readable/writable\]ObjectMode as they are used has readonly properties in Node.js >= 12

## [2.0.2] - 2019-04-13
### Changed
- Refactor the entire project in typescript

## [1.2.0] - 2018-05-07
### Added
- Duplex stream mock

## [1.1.0] - 2018-05-07
### Added
- new `flatData` property added to `WritableMock`

## [1.0.2] - 2018-03-12
### Added
- more tests

### Fixed
- babel-runtime dependency
- README lint (after codeclimate report)

## [1.0.1] - 2018-03-12
### Fixed
- typo in README

## [1.0.0] - 2018-03-12
### Added
- Create a readable stream for any iterable
- Create a writable stream that puts its datas at your disposal
- Can operate both in object and normal (Buffer) mode

__________________________________________________________________________________________

[Unreleased]: https://github.com/b4nst/stream-mock/compare/v2.0.5...HEAD
[2.0.5]: https://github.com/b4nst/stream-mock/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/b4nst/stream-mock/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/b4nst/stream-mock/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/b4nst/stream-mock/compare/v1.2.0...v2.0.2
[1.2.0]: https://github.com/b4nst/stream-mock/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/b4nst/stream-mock/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/b4nst/stream-mock/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/b4nst/stream-mock/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/b4nst/stream-mock/releases/tag/v1.0.0
