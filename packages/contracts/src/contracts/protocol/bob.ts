import { AsyncContractConfigData } from '../../types';

export const bob: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0xc17C6462cEAFE9A8819258c6bA168BEF5544Fc21',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  merkleDistributor: {
    address: '0x0', // todo: update address
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
  runeBridge: {
    address: '0x8989E07E565966463C73dadE4c095DaC991e1dD2',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};