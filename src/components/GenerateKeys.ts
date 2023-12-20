import useWallet from '@/hooks/useWallet'
import { EVM_CHAINID, getSignTypedData } from '@/utils/wallets'
import { AES } from 'crypto-js'
import { useSignTypedData } from 'wagmi'

const staticEncryptionKey = import.meta.env.VITE_PK_ENCRYPTION_KEY

export default async function GenerateKeys() {
  const { setWalletFromEvmSignature, saveEvmSignature, switchEvmNetworkAsync } = useWallet()
  const signTypedData = getSignTypedData()
  // Check evm chainId & switch if needed
  await switchEvmNetworkAsync()
  const { signTypedDataAsync } = useSignTypedData({
    ...signTypedData,
    domain: {
      ...signTypedData.domain,
      chainId: EVM_CHAINID,
    },
  })
  const signature = await signTypedDataAsync()
  await setWalletFromEvmSignature(signature)
  const encryptedSignature = AES.encrypt(signature, staticEncryptionKey).toString()
  saveEvmSignature(encryptedSignature)
}
