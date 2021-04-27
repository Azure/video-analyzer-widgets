/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * Ensure that tree-shaking doesn't remove these components from the bundle.
 * There are multiple ways to prevent tree shaking, of which this is one.
 */

import * as Window from './window';
Window;

import * as globalExport from './global.export';
globalExport;

import * as npmExport from './npm.export';
npmExport;

import { FASTButton, FASTMenu, FASTMenuItem } from '@microsoft/fast-components';

FASTButton;
FASTMenu;
FASTMenuItem;
