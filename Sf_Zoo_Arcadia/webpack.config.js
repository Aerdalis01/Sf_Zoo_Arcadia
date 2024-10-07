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
    .enableReactPreset()
    .enableStimulusBridge('./assets/controllers.json')
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

module.exports = Encore.getWebpackConfig();
;

module.exports = Encore.getWebpackConfig();
