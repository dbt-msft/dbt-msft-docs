---
title: Using VSCode with dbt
sidebar_position: 2
---

# Using dbt in VSCode

## Intro

When our team first started using the dbt CLI, we started with Claire's well-loved discourse post, [How we set up our computers for working on dbt project](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243). The post details how the dbt team uses Atom and iTerm 2 on macOS for an improved workflow. Many folks commented on how they acheived similar productivity using VSCode. I thought I'd consolidate some of this into a single article, and expand on it given the recent developments. I'm also going to add things to make it easier for working with Azure databases such as the Azure CLI and Azure Data Studio.

### Prerequisite

If you've never used VSCode with Python, I strongly recommend at least the first half of  Dan Taylor's [Get Productive with Python in Visual Studio Code](https://www.youtube.com/watch?v=PnOPp4DsY2w) talks. It covers a lot of the basics like installing Python, the Python extension, and the command pallette.

You should also have the following installed:

- Git
- VSCode
- Python 3 (via anaconda, brew or [python.org](https://www.python.org/downloads/) )

In VSCode you'll also need to install the Python extension

### If you already know VSCode

Here's [a gist for an example .vscode directory](https://gist.github.com/swanderz/5cf876d88c7c8d268d8c1e1e5d05bffd) that contains a `settings.json` and an `extensions.json`

### Getting started

To get started, we'll use the [jaffle_shop repo](https://github.com/dbt-labs/jaffle_shop), a self-contained project.

You can use the Git CLI or the VSCode Git extension to Git Clone command in VSCode
```bash
git clone https://github.com/dbt-labs/jaffle_shop.git
```

Then, open the `jaffle_shop/` directory in VSCode.

## Python environment


### Goal

The goal of this section is to ensure that the right version of Python and dbt are always available right away when you open your dbt project in VSCode. Sounds simple, but below is a one-time setup guide on how to make it work

### Walkthrough

Python can be tricky get working in VSCode (and trickier to work on Windows). You OS likely already has a version of python installed, but this can be troublesome because you don't control it's version.

It's better practice to have a dedicated dbt environment. Three popular tools are `venv`'s, `virtualenv`'s and `conda` environments. Our team uses `conda` envs because we have many different projects with different sets of package requirements, but if dbt is 1) your only use case for Python, or 2) your first Python-based use case, you'll likely have a better time with `virtualenvs`. I'm going to only talk about venv because it comes built-in with Python

Open a terminal with `CTRL+`` (which should open within the jaffle_shop directory) and do the following steps:

```bash
# make sure you have Python at least 3.6 and less than 3.10
# Create and activate virtual environment
python3 -m venv .dbtenv
source .dbtenv/bin/activate

# install the dbt package you want
pip install dbt-synapse # or dbt-sqlserver or whatever

# make Git ignore all these newly created files
echo '.dbtenv/' > .gitignore
```

Once you've done this you should now be able to:
1. bring up the command pallette (`CMD+SHIFT+P`)
2. search for "Python: Select Interpreter", and
3. Pick the `.dbtenv` environment (should be the first result)

Those three steps will:

1. activate the Python extension if it hasn't been already
2. ensure that all new terminals opened in VSCode will auto-activate your `.dbtenv` environment

This is huge because now all your terminals in the VSCode will always have your dbt package available. However, this behavior will not persist the next time you open this repo in VSCode. To make this auto-env selection persist, you must do two things:
1. add a `requirements.txt` to you the top level of the repo ([pip docs on `requirements.txt` files](https://pip.pypa.io/en/stable/user_guide/#requirements-files))
2. (optional) add to the `requirements.txt` what packages w/ versions you plan to do in this project (example below)
3. create a new file `.vscode/settings.json` and add the Python path to the `settings.json` (more on VSCode settings later!)

#### `requirements.txt`
```
dbt-synapse==0.19.2
sqlfluff==0.7.1
```
#### `.vscode/settings.json`
```json
{
    // change this to your desired path!
    "python.pythonPath": "./.dbtenv/bin/python",
}
```

Now that you've done these two things, everytime you open the `jaffle_shop/` dir, in VSCode two things should happen:
1. the Python extension activates right away (do you see the Python version listed alongside your environment name on the bottom info bar?)
2. any terminal you open will auto-activate your `.dbtenv` and each line should begin with `(.dbtenv)`

You should test this by closing VSCode, then opening the `jaffle_shop` repo

## Extensions

### vscode-dbt

the [vscode-dbt extension](https://marketplace.visualstudio.com/items?itemName=bastienboutonnet.vscode-dbt)

### Find Related

the [find-related extension](https://marketplace.visualstudio.com/items?itemName=amodio.find-related)

### Rainbow CSV

the [rainbow-csv extension](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

## Settings

## Usage / Startup






