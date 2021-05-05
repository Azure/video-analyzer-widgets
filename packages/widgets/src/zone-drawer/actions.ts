
import { DELETE_SVG_PATH, RENAME_SVG_PATH } from './../../../styles/svg/svg.shapes';
import { UIActionType } from './../../../../out/spec/web-components/src/actions-menu/actions-menu.definitions';
export const ZoneDrawerActions = [
    {
        label: 'Rename',
        svgPath: RENAME_SVG_PATH,
        type: UIActionType.RENAME
    },
    {
        label: 'Delete',
        svgPath: DELETE_SVG_PATH,
        type: UIActionType.DELETE
    }
];
