import {describe,it,expect} from 'vitest';
import {money} from './index';
describe('AZN formatting',()=>{it('preserves qəpik and required decimal notation',()=>{expect(money(2790)).toBe('27.90 ₼');expect(money(0)).toBe('0.00 ₼');});it('rejects invalid monetary amounts',()=>{for(const value of [-1,1.5,NaN,Infinity])expect(()=>money(value)).toThrow();});});
