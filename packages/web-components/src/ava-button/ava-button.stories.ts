import { AVAButton } from '.';
interface ITemplate {
    text: string;
}

// Prevent tree-shaking
AVAButton;

const AVAButtonTemplate = (data: ITemplate) => {
    const btn = document.createElement('ava-button');
    // if (data.text) {
    //     btn.text = data.text;
    // }
    return btn;
};

export const Example = (args: ITemplate) => AVAButtonTemplate(args);

export default {
    title: 'Example Component',
    argTypes: {
        text: { control: 'text' }
    }
};
