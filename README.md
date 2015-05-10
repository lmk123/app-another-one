# Another One
Another One is an unofficial mobile app for [『The One』](http://wufazhuce.com/one/). [What is this?](#what-is-the-one)

## Feature

The feature (and the different of the official app) is:

 + It provide all the previous volumes. The official app just provide the latest 10 volumes.
 + Since you read one of volumes once, the content of that volume will save in your device, so after that, you can read it even if you are offline.
 + You can collect your favourite volume into the _Favourite List_.

## Preview Online

http://lmk123.github.io/app-another-one/

Online version support IE9+ and other modern browser, but only **Chrome** support the _Volume Cache_ and _Favourite List_ feature.

## Build to APK file
Another One use PhoneGap to build to apk file. It requires one plugin only: [org.apache.cordova.file](http://plugins.cordova.io/#/package/org.apache.cordova.file).

 1. Run `gulp`
 2. Change the value of `src` attribute on node `content` in `config.xml`
 3. Run `cordova build`
 
## Statement
 This program is only made for learning, the copyright of all the content of volumes belongs to [『The One』](http://www.wufazhuce.com/one/).
 
## License
 [GNU General Public License Version 3](https://www.gnu.org/licenses/gpl.html) or higher version.

#### What is 『The One』?
It is one of my favourite online and literary magazine, founded by [Han Han](http://en.wikipedia.org/wiki/Han_Han). It published one photo , one article and one question every day as one volume, and I use its [official mobile app](http://shouji.baidu.com/software/item?docid=7662760) to read these.
