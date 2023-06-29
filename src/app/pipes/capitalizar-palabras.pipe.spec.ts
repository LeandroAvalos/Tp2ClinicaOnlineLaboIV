import { CapitalizarPalabrasPipe } from './capitalizar-palabras.pipe';

describe('CapitalizarPalabrasPipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizarPalabrasPipe();
    expect(pipe).toBeTruthy();
  });
});
