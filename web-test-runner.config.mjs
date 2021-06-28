/**
 * Please find more information here
 * https://modern-web.dev/guides/going-buildless/getting-started/
 * https://open-wc.org/docs/testing/testing-package/
 */
import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
    files: 'out/spec/**/*.spec.js',
    nodeResolve: true,

    /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
    // esbuildTarget: 'auto',
    plugins: [
        esbuildPlugin({ ts: true, target: 'auto-always' }),
        importMapsPlugin({
            inject: {
                importMap: {
                    imports: {
                        simplebar: '/mocks/simplebar.js'
                    }
                }
            }
        })
    ],

    /** Configure bare import resolve plugin */
    nodeResolve: true,

    /** Amount of browsers to run concurrently */
    concurrentBrowsers: 2,

    /** Amount of test files per browser to test concurrently */
    concurrency: 1,

    /** Browsers to run tests on */
    browsers: [playwrightLauncher({ product: 'chromium' }), playwrightLauncher({ product: 'firefox' })]
});
