// Web 3 instance creation with Metamask provider (with accounts and keys)
import Web3 from "web3";

// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
// Use request to submit RPC requests to Ethereum via MetaMask. It returns a Promise that resolves to the result of the RPC method call.
// All Web3 instances needs a provider as param.
window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;