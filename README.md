# kbn-shoehorn

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/kbn-shoehorn/master/LICENSE)
[![npm](https://img.shields.io/npm/v/kbn-shoehorn.svg)](https://www.npmjs.com/package/kbn-shoehorn)

Shoehorn Kibana plugins into your plugins path.

# Usage

Install `kbn-shoehorn` globally and use it to install plugins from the kibana path.

```
npm install -g kbn-shoehorn
# or with yarn
yarn global add kbn-shoehorn
```

Simply run `kbn-shoehorn` from the root of your Kibana path, and follow the prompts.

![kbn-shoehorn usage](http://i.imgur.com/pAegdtw.png)

### Specify the plugin inline

You can optionally pass the username/repo as the first argument as well to skip the first question.

```
kbn-shoehorn snuids/Elastic-5.0-Country-Map-Visualizer
```

### Load plugin from local path

If you need to install a plugin from your machine, you can use the `-f` flag, passing it the path to the plugin. Currently only directories are supported.

```
kbn-shoehorn -f ~/Download/enhanced_tilemap/
```

### Non Interactive Options

If you prefer to script plugin installation, or just not deal with the questions at all, you can can mix the inlining of the username/repo argument with the `-y` flag, which will assume defaults for all other questions.

```
kbn-shoehorn snuids/Elastic-5.0-Country-Map-Visualizer -y
```

By default, this will pull from the `master` branch of the repo. If you still need to specify a specific branch, you can do so using the `--branch` option.

```
kbn-shoehorn snuids/Elastic-5.0-Country-Map-Visualizer -y --branch=v5.1
```

## Why?

Kibana comes package with its own plugin installer, so why shoehorn plugins? The answer can be found simply by looking at the installation instructions on just about *every* third party Kibana plugin out there. All of them generally ask you to download the plugin from github, or some other repo source, and copy it into the plugins path. Since Kibana expects a plugin's version (or `kibana.version`) to match Kibana's version down to the patch release, many also ask the user to modify the `package.json` file to match your version of Kibana.

Kibana's plugin installer requires authors to publish a zip file somewhere for the installer to download and unpack. There's a reason for this, related to build assets, but most plugins don't need this, so it's just extra overhead for authors. And as you can see from their installation steps, they don't bother with this step.

That's a lot of manual steps just to author and to use a plugin. We can do better.

`kbn-shoehorn` handles all the steps you usually have to do manually, so you can get plugins installed and ready to run with 1 command.

## Installing from repo

`kbn-shoehorn` can use a git repo's username/repo path. It will download the plugin directly from the repo and place it in the Kibana plugins path. See the [download-git-repo](https://github.com/flipxfx/download-git-repo#examples) docs for options other than github.

## Versioning

`kbn-shoehorn` doesn't enforce anything. Instead, it will re-write the `version` (or `kibana.version`) in the `package.json` so it matches Kibana's version. This may not be safe, as the author of the plugin may not have meant for the plugin to work with the version of Kibana you are running. But it's your Kibana, that's for *you* to decide.

## Speed

When you install a plugin using Kibana's built in installer, it will run the optimization step every time. This can be really time consuming when you are trying to install several plugins at once. `kbn-shoehorn` just copies the plugin and leaves that step for when you start Kibana.

#### License

MIT © [w33ble](https://github.com/w33ble)