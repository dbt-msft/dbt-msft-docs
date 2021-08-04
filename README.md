# dbt-sqlserver-docs

This website is built as a companion for [dbt-sqlserver](https://github.com/dbt-msft/dbt-sqlserver) using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

The latest version of this site is hosted via Github Pages at [https://dbt-msft.github.io/dbt-msft-docs/](https://dbt-msft.github.io/dbt-msft-docs/)

## Working Branches
Name | Usage
--- | ---
main | Latest live version of dbt-sqlserver-docs, any update to this branch will be deployed to github pages site
develop | Develop and modify web oriented work including but not limited to: React components, styling, Docusaurus configuration, and CI / CD.
documentation | Manage changes to the content of the site. Most changes are to be made within the /docs and /static directories.



---



## Usage (NPM)

### Installation

```console
npm install
```

### Local Development

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.
```console
npm run start
```


### Build

This command generates static content into the `build` directory and can be served using any static contents hosting service. Builds can be then hosted via any static site server.
```console
npm run build
```



---



## Usage (Yarn)

### Installation

```console
yarn install
```

### Local Development

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. Builds can be then hosted via any static site server.
```console
yarn start
```


### Build

This command generates static content into the `build` directory and can be served using any static contents hosting service.
```console
yarn build
```
