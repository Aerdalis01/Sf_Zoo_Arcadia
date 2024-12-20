const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .copyFiles({
        from: './assets/fonts',
        to: 'fonts/[name].[hash:8].[ext]'
    })
    .addEntry('app', './assets/app.tsx')
    .splitEntryChunks()

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')
    .enableReactPreset()
    

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })
    .enableSassLoader()
    .enableTypeScriptLoader()
    const webpack = require('webpack');

    Encore.addPlugin(
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://arcadiabroceliande.com'
            })
        })
    );
module.exports = Encore.getWebpackConfig();
;

