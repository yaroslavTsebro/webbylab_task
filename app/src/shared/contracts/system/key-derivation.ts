export interface IKeyDerivationService {
  derive(input: string): Promise<string>;
  verify(input: string, stored: string): Promise<boolean>;
}
