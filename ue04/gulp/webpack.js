import webpack from 'webpack'
// import WebpackDevServer from 'webpack-dev-server'
import gutil from 'gulp-util'

export default function(gulp, plugins, args, config, taskTarget, browserSync) {

    gulp.task('webpack', done => {

        // run webpack
        let compiler = webpack(config, function(err, stats) {
            if(err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            browserSync.reload('*.js');
        });

        return

        new WebpackDevServer( compiler, {
            hot: true,
            // Enable special support for Hot Module Replacement
            // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
            // Use "webpack/hot/dev-server" as additional module in your entry point
            // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

            // Set this as true if you want to access dev server from arbitrary url.
            // This is handy if you are using a html5 router.
            historyApiFallback: false,


            // webpack-dev-middleware options
            quiet: false,
            noInfo: false,
            lazy: true,
            filename: "main.js",
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            headers: { "X-Custom-Header": "yes" },
            stats: { colors: true },
        })

    })
}
