import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Browser executable: on the VM, use the locally installed chrome-headless-shell.
// On GitHub Actions (or any machine without that path), skip this so Remotion
// uses the browser installed by `npx remotion browser install`.
const vmBrowser =
	'/home/hatch/workspace/tiktok-pipeline/.browser/chrome-headless-shell-linux64/chrome-headless-shell';
if (fs.existsSync(vmBrowser)) {
	Config.setBrowserExecutable(vmBrowser);
}
