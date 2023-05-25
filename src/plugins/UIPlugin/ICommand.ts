export default interface ICommand {
  execute(arg: Record<string, unknown>): void;
}
