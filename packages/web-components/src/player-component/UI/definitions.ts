export interface ISeekBarElement {
    bar: IBarElement;
    container: Element;
}

export interface IBarElement extends HTMLElement {
    min: string;
    max: string;
}
