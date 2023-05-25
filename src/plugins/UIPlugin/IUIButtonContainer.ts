import IUIButton from "./IUIButton";

export default interface IUIButtonContainer extends IUIButton {
  setText(text: string): this;
  setTextStyle(style: object): this;
}
