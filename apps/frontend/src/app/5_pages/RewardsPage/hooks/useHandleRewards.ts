import { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import { getContract } from '@sovryn/contracts';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { GAS_LIMIT_REWARDS } from '../../../../utils/constants';
import { toWei } from '../../../../utils/math';
import { RewardsAction } from './../types';

export const useHandleRewards = (action: RewardsAction, amount: string) => {
  const { t } = useTranslation();
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const isWithdrawTransaction = useMemo(
    () => action === RewardsAction.withdrawFromSP,
    [action],
  );

  const title = useMemo(
    () =>
      isWithdrawTransaction
        ? t(translations.rewardPage.tx.withdrawGains)
        : t(translations.rewardPage.tx.transferToLOC),
    [isWithdrawTransaction, t],
  );

  const transactionTitle = useMemo(
    () =>
      isWithdrawTransaction
        ? t(translations.rewardPage.tx.withdraw)
        : t(translations.rewardPage.tx.transfer),
    [isWithdrawTransaction, t],
  );

  const getStabilityPoolContract = useCallback(async () => {
    const { address, abi: massetManagerAbi } = await getContract(
      'stabilityPool',
      'zero',
      getRskChainId(),
    );

    return new ethers.Contract(address, massetManagerAbi, signer);
  }, [signer]);

  const handleAction = useCallback(async () => {
    const transactions: Transaction[] = [];
    const stabilityPool = await getStabilityPoolContract();

    transactions.push({
      title: title,
      contract: stabilityPool,
      fnName: action,
      args: isWithdrawTransaction ? [toWei(amount)] : [account, account],
      config: { gasLimit: GAS_LIMIT_REWARDS }, // TODO: add a different limit for transfer if needed
    });

    setTransactions(transactions);
    setTitle(transactionTitle);
    setIsOpen(true);
  }, [
    getStabilityPoolContract,
    title,
    action,
    isWithdrawTransaction,
    amount,
    account,
    setTransactions,
    setTitle,
    transactionTitle,
    setIsOpen,
  ]);

  return handleAction;
};