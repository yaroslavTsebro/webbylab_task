import { IKeyDerivationService } from 'shared/contracts/system/key-derivation';
import { randomBytes, pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

export class KeyDerivationService implements IKeyDerivationService {
  private readonly iterations: number;
  private readonly keyLength: number;
  private readonly digestAlgorithm: string;
  private readonly saltLength: number;

  constructor(
    iterations = 100_000,
    keyLength = 64,
    digestAlgorithm: 'sha256' | 'sha512' = 'sha512',
    saltLength = 16
  ) {
    this.iterations = iterations;
    this.keyLength = keyLength;
    this.digestAlgorithm = digestAlgorithm;
    this.saltLength = saltLength;
  }

  public async derive(input: string): Promise<string> {
    const salt = randomBytes(this.saltLength).toString('hex');
    const derivedKey = await pbkdf2Async(
      input,
      salt,
      this.iterations,
      this.keyLength,
      this.digestAlgorithm
    );
    
    return `${this.iterations}:${salt}:${derivedKey.toString('hex')}`;
  }

  public async verify(input: string, stored: string): Promise<boolean> {
    const [iterStr, salt, originalKey] = stored.split(':');
    const iterations = parseInt(iterStr, 10);

    const derivedKey = await pbkdf2Async(
      input,
      salt,
      iterations,
      this.keyLength,
      this.digestAlgorithm
    );
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const originalBuffer = Buffer.from(originalKey, 'hex');

    if (keyBuffer.length !== originalBuffer.length) {
      return false;
    }

    return timingSafeEqual(keyBuffer, originalBuffer);
  }
}