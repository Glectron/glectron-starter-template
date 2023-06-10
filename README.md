# Glectron Example Application
This is an example to build a Glectron application at the moment, can be used as a starter template.

Please note that current application development workflow is incomplete, and Glectron is still unstable. It's not a good idea to build a Glectron application now.

Also, this example application is only designed to be compatible with Chromium, which means it won't work properly in Awesomium-based Garry's Mod.

Type `!gexampleapp` in chat box to open up the window.

In order to make sure Lua files are small enough to make autorefresh work, while in development mode, the build workflow will use `glectron-asset-relocator`, which copies all assets into `dist/relocated` folder. What you need to do is to make sure your game's `garrysmod/relocator`'s content is sync with `dist/relocated` folder, otherwise your assets won't be loaded normally.