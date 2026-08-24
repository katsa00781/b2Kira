import type { ComponentType } from 'react';

import type { CharacterId } from '@/data/characters';

import { Bunny } from './Bunny';
import { Lion } from './Lion';
import { Monkey } from './Monkey';
import { Panda } from './Panda';
import type { CharacterProps } from './types';

export { Bunny, Lion, Monkey, Panda };
export { CHARACTER_SIZE, type CharacterMood, type CharacterProps } from './types';

/** Id → komponens, hogy a képernyőknek ne kelljen négyfelé ágazniuk. */
export const characterComponents: Record<CharacterId, ComponentType<CharacterProps>> = {
  bunny: Bunny,
  panda: Panda,
  monkey: Monkey,
  lion: Lion,
};
