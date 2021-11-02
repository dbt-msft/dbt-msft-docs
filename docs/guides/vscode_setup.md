---
title: Using VSCode with dbt
sidebar_position: 2
---

# Using dbt in VSCode

## Intro

When our team first started using the dbt CLI, we started with Claire's well-loved discourse post, [How we set up our computers for working on dbt project](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243). The post details how the dbt team uses Atom and iTerm 2 on macOS for an improved workflow. Many folks commented on how they acheived similar productivity using VSCode. I thought I'd consolidate some of this into a single article, and expand on it given the recent developments. I'm also going to add things to make it easier for working with Azure databases such as the Azure CLI and Azure Data Studio.

### Goals

Following this guide will enable the following behavior in VSCode (some points lifted from Claire's guide -- linked above)

- a stable, reproducible Python environment for running dbt
- syntax highlighting for SQL files with jinja in them
- graying out the text of files that have compiled code in them, to help prevent you from editing compiled SQL (as opposed to your actual model)
- quick switching b/w a model file and it's `compiled` and `run` counterparts 
- allow  


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

In this section, I'll go over some of the extensions that our team uses. Each extension requires that you install it from within VSCode, and most will require adding additional settings to your `.vscode/settings.json`

### vscode-dbt

the [vscode-dbt extension](https://marketplace.visualstudio.com/items?itemName=bastienboutonnet.vscode-dbt) is great because it provides a few things:
1. syntax highlighting for SQL with jinja in it (also for `.md`'s and `.yml`s), and
2. helpful jinja snippets will save you a lot of time


To get this working you should add the following to your `.vscode/settings.json`

There's an optional addition I strongly recommend `"**/target/**": "",`, which will not do any syntax highlighting/colorization to any file in the `target/` folder. This prevents me from making the classic mistake where I start editing a compiled model file, instead of the original model file. Then when I call `dbt run` my changes aren't incorporated, but instead overwritten by the unchanged logic of the model file. with this setting you know something is wrong then the sql has no coloring.

```json
"files.associations": {
    // the pattern on the left side can be whatever you want: e.g.
    "**/jaffle_shop/**/*.sql": "jinja-sql", // just the .sqlfiles inside of jaffle_shop, or
    "*.sql": "jinja-sql", // all .sql files

    // optional: don't format models in `target/` dir
    "**/target/**": "",
    // I don't personally use these, but you can also have jinja work for `yaml` and `md` files
    "**/<dbt-project-dir>/**/*.yaml": "jinja-yaml",
     "**/<dbt-project-dir>/**/*.yml": "jinja-yaml",
    "**/<dbt-project-dir>/**/docs/**/*.md": "jinja-md"

    // the vscode-dbt docs say you may need this
    "editor.quickSuggestions": {
    "strings": true
    }
}
```

You'll know it is working when you open a `.sql` model and, in the bottom toolbar on the right it says now says "Jinja SQL" instead of "SQL".

### Find Related

the [find-related extension](https://marketplace.visualstudio.com/items?itemName=amodio.find-related) allows you to use regular expressions to correspond a `.sql` file in your `models/` directory to it's `compiled` and `run` counterparts in the `target/` folder. I find this a huge timesaver compared to manually naviagting the `target/` dir in the explorer sidebar.

After you install the `find-related` extension, you can enable it by adding the following to your `.vscode/settings.json`. There's no dbt or jinja magic going on here, just regex. So you may need to tweak these settings if they're not working for you.

Once it is set up, you can type `Option+R` on any model file to jump to it's compiled version. While on a compiled model file, `Option+R` will take you to it's `target/run` counterpart.


```json
{
    // this is so you can easily jump to your compiled SQL files
    "findrelated.workspaceRulesets": [
        {
            "name": "sql",
            "rules": [
                {
                    "pattern": "^(.*/)?models/(.*/)?(.+\\.sql)$",
                    "locators": [
                        "**/compiled/**/$3"
                    ]
                },
                {
                    "pattern": "^(.*/)?compiled/(.*/)?(.+\\.sql)$",
                    "locators": [
                        "**/run/**/$3"
                    ]
                },
                {
                    "pattern": "^(.*/)?run/(.*/)?(.+\\.sql)$",
                    "locators": [
                        "**/models/**/$3"
                    ]
                }
            ]
        }
    ],
    "findrelated.applyRulesets": [
        "sql"
    ]
    }
```

### Rainbow CSV

the [rainbow-csv extension](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) just highlights csvs where each column is it's own color. It's great to use when you have a csv where character-width varies greatly within a column. You can also hover over a value to see what column it belongs to. Very helpful for seeds!

### SQL Fluff

Our team has recently implemented sqlfluff linting for our dbt projects, especially because versions `0.6.5` and greater now support TSQL. There's also a great VCcode extenstion.

If you already have a `.sqlfluff` and `.sqlfluffignore` configured and working, it is enough to install [vscode-sqlfluff](https://marketplace.visualstudio.com/items?itemName=dorzey.vscode-sqlfluff) and add the following to your `settings.json`

```json
    // you get this by calling `where sqlfluff` after calling `pip install sqlfluff`
    "sql.linter.executablePath": "<PATH_TO_YOUR_SQLFLUFF_FROM_WHICH_SQLFLUFF_COMMAND",
    "sql.linter.run": "onType" // alternatively "onSave" if you'd like it less frequent 
```

## Settings

### Extra settings
Here's some other settings that I recommend:


```json
        // easier to see if there are unsaved changed
        "workbench.editor.highlightModifiedTabs": true,
        "workbench.editor.labelFormat": "medium",
        // make Command Prompt the default shell for Windows instead of Powershell
        "terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
        
        // make a vertical line so I don't make lines too long
        "editor.rulers": [80],
        // show whitespace as dots
        // (easier to count out indentation and spot trailing whitesapce)
        "editor.renderWhitespace": "all",
```

### Workspace-level settings files

Sometimes it isn't convenient to have a `.vscode/settings.json`, such as when you:
1. have a subset of settings under source control that you'd like all users to be using (it doesn't make sense to source control your specific Python path)
2. you prefer [multi-root workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces) a.k.a. more than one repo open at at time (great for when you also want your `.dbt/profiles.yml` close at hand)

A worksapce settings file has the extension `.code-workspace` and encapsulates all the configuration you might find in a `.vscode/` dir into a single file. This file also works as a shortcut that you can double click or navigate to to bring up all your settings.

If someone wants more info on this free free to open an issue. For now I'll leave this as as stub.


