---
title: Contributing to dbt-msft-docs
sidebar_position: 5
---

# Contributing to dbt-msft-docs

This webpage is built using [Docusaurus](https://docusaurus.io/). This library allows us to generate a static webpage based on standard Markdown documents. As can be seen in the [dbt-msft-docs/docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main/docs) directory, the contents of this entire site are made up of these documents.

## Repository Branch Usage

Adding or altering content on this page can be split into 2 separate disciplines. This repository contains two branches which are used for the following purposes.
1. `develop` - Altering the layout, styling, themes, and external links of the documentation site.
2. `documentation` - Adding or altering the order of pages and their content.

Before making changes please review the [README](https://github.com/dbt-msft/dbt-msft-docs/blob/main/README.md) and the [Docusaurus Installation Guide](https://docusaurus.io/docs/installation) of this repo for local installation and setup instructions.


## Editing an Existing Document

All documents on this website can be found in the [dbt-msft-docs/docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main/docs) directory. Modifying the content of this site can be done by simply changing these files by doing the following.

1. Ensure you have the proper access rights to this repository or alternatively, fork this repository.
2. Clone [dbt-msft-docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main) on your local machine.
   
	```
	git clone https://github.com/dbt-msft/dbt-msft-docs.git
	```
3. Create your own branch from or checkout the `documentation` branch.
4. Under the /docs directory modify the existing markdown file content as necessary. Aside from [Advanced Docusaurus Markdown Features](https://docusaurus.io/docs/markdown-features), the files consist of standard markdown syntax.

  	You may notice the beginning of each markdown file uses some header display metadata used by Docusaurus that is not rendered. This includes the page `title` which is the display name of the page in the sidebar and the `sidebar_position` which defines the order of the pages or directories of pages.
	
	```jsx title="contributing.md"
	---
	title: Contributing to dbt-msft-docs 
	sidebar_position: 5
	---
	```

	> Note: When a markdown file is in the root docs/ directory the `sidebar_position` defines the order in which it appears in the sidebar. However if the markdown file is within a directory it defines the order the document is displayed within its nested expansion panel. The sub directories themselves must each contain a `_category_.json` file which defines this same metadata for the expansion panel.

5. Build and test your changes on a local server.
		
	```
	npm run build
	```

	```
	npm run start
	```

6. Push your changes and create an appropriate pull request into the `main` branch. This will run some automated checks and upon merge will automatically deploy changes to [https://dbt-msft.github.io/dbt-msft-docs/](https://dbt-msft.github.io/dbt-msft-docs/)

## Adding a New Document

Much like editing a new page created in the [dbt-msft-docs/docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main/docs) directory will automatically appear in the webpage. When adding new documents some extra care must be taken to ensure the `sidebar_position` is correct.

1. Ensure you have the proper access rights to this repository or alternatively, fork this repository.
2. Clone [dbt-msft-docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main) on your local machine.
   
	```
	git clone https://github.com/dbt-msft/dbt-msft-docs.git
	```
3. Create your own branch from or checkout the `documentation` branch.
4. Under the /docs directory or the appropriate subdirectory create a new markdown file
5. Add the `title` and `sidebar_position` to the beginning of the document. An example can be seen below.
	
	```jsx title="contributing.md"
	---
	title: Contributing to dbt-msft-docs 
	sidebar_position: 5
	---
	```
		
	> Note: When a markdown file is in the root docs/ directory the `sidebar_position` defines the order in which it appears in the sidebar. However if the markdown file is within a directory it defines the order the document is displayed within its nested expansion panel. The sub directories themselves must each contain a `_category_.json` file which defines this same metadata for the expansion panel. If a new directory is created this file must be also created to maintain the appropriate order.

6. Ensure the `sidebar_position` in the new file or `position` in the `_category_.json` does not conflict with other documents. Update these other documents as necessary.
7. Build and test your changes on a local server.
		
	```
	npm run build
	npm run start
	```

8. Push your changes and create an appropriate pull request into the `main` branch. This will run some automated checks and upon merge will automatically deploy changes to [https://dbt-msft.github.io/dbt-msft-docs/](https://dbt-msft.github.io/dbt-msft-docs/)

## Changing the Default Home Page

The homepage of docusaurus sites by default is a React webpage rendered using custom components. For dbt-msft-docs we do not need this functionality so by default we simply redirect the user from the homepage to a predefined page. Because this falls into the discipline 1. described in [Repository Branch Usage](#repository-branch-usage) to make this change we advise using the `develop` branch.

1. Ensure you have the proper access rights to this repository or alternatively, fork this repository.
2. Clone [dbt-msft-docs](https://github.com/dbt-msft/dbt-msft-docs/tree/main) on your local machine.
   
	```
	git clone https://github.com/dbt-msft/dbt-msft-docs.git
	```
3. Create your own branch from or checkout the `development` branch.
4. Modify the content of [src/pages/index.js](https://github.com/dbt-msft/dbt-msft-docs/blob/main/src/pages/index.js) to redirect to the desired page.
	
	```jsx title="src/pages/index.js"
	import React from 'react';
	import { Redirect } from 'react-router-dom';
	import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

	export default function Home() {
		const { siteConfig } = useDocusaurusContext();
		// Edit this line changing the string to docs/<markdown file id>
		return <Redirect to={`${siteConfig.baseUrl}docs/better_together_pitch`} />;
	}
	```

	> Note: The url of each markdown file defaults to the file name without the `.md` suffix this is known as the `id` of the document and can be configurable if necessary.