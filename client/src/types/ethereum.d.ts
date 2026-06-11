// Type declaration for window.ethereum (MetaMask / EIP-1193 provider)
interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: (data: unknown) => void): void;
  removeListener(event: string, handler: (data: unknown) => void): void;
  isMetaMask?: boolean;
}

interface Window {
  ethereum?: EthereumProvider;
}
