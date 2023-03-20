import { useWallets } from '@polkadot-onboard/react';
import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

export const useConnectToStoredAccount = () => {
  const { wallets } = useWallets();
  const { activeAccount, storedActiveAccount, setActiveAccount, setActiveWallet } = useAccounts();
  const [isAutoConnectDone, setIsAutoConnectDone] = useState(false);

  const connectToStoredAccount = useCallback(async () => {
    if (storedActiveAccount !== null && Array.isArray(wallets) && wallets.length > 0) {
      const foundWallet = wallets.find((wallet) => wallet.metadata.title === storedActiveAccount.wallet);

      if (foundWallet) {
        await foundWallet.connect();
        const accounts = await foundWallet.getAccounts();
        const foundAccount = accounts.find(
          (account) => account.address.toLocaleLowerCase() === storedActiveAccount.account.toLocaleLowerCase(),
        );
        if (foundAccount) {
          setActiveWallet(foundWallet);
          setActiveAccount(foundAccount);
        }
      }
    }

    if (Array.isArray(wallets)) {
      setIsAutoConnectDone(true);
    }
  }, [storedActiveAccount, wallets, setActiveAccount, setActiveWallet]);

  useEffect(() => {
    connectToStoredAccount();
  }, [connectToStoredAccount]);

  return {
    wallets,
    activeAccount,
    isAutoConnectDone,
  };
};
