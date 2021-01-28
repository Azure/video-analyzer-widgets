/**
 * Please find more information here
 * https://modern-web.dev/guides/going-buildless/getting-started/
 * https://open-wc.org/docs/testing/testing-package/
 */
import { playwrightLauncher } from '@web/test-runner-playwright';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
    files: 'out/spec/**/*.spec.js',
    nodeResolve: true,

    /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
    // esbuildTarget: 'auto',

    /** Configure bare import resolve plugin */
    // nodeResolve: {
    //   exportConditions: ['browser', 'development']
    // },

    /** Amount of browsers to run concurrently */
    concurrentBrowsers: 2,

    /** Amount of test files per browser to test concurrently */
    concurrency: 1,

    /** Browsers to run tests on */
    browsers: [playwrightLauncher({ product: 'chromium' }), playwrightLauncher({ product: 'firefox' })]
});
