const { ethers } = require("ethers");
const BentoBoxAddress='0x0319000133d3AdA02600f0875d2cf03D442C3367';
const BentoBoxABI= 
[{"inputs":[{"internalType":"contract IERC20","name":"wethToken_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"masterContract","type":"address"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":true,"internalType":"address","name":"cloneAddress","type":"address"}],"name":"LogDeploy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"share","type":"uint256"}],"name":"LogDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"borrower","type":"address"},{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"feeAmount","type":"uint256"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"}],"name":"LogFlashLoan","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"protocol","type":"address"}],"name":"LogRegisterProtocol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"masterContract","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"LogSetMasterContractApproval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LogStrategyDivest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LogStrategyInvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LogStrategyLoss","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LogStrategyProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"contract IStrategy","name":"strategy","type":"address"}],"name":"LogStrategyQueued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"contract IStrategy","name":"strategy","type":"address"}],"name":"LogStrategySet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"targetPercentage","type":"uint256"}],"name":"LogStrategyTargetPercentage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"share","type":"uint256"}],"name":"LogTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"masterContract","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"LogWhiteListMasterContract","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"share","type":"uint256"}],"name":"LogWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"calls","type":"bytes[]"},{"internalType":"bool","name":"revertOnFail","type":"bool"}],"name":"batch","outputs":[{"internalType":"bool[]","name":"successes","type":"bool[]"},{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IBatchFlashBorrower","name":"borrower","type":"address"},{"internalType":"address[]","name":"receivers","type":"address[]"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"batchFlashLoan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"masterContract","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bool","name":"useCreate2","type":"bool"}],"name":"deploy","outputs":[{"internalType":"address","name":"cloneAddress","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token_","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"share","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"shareOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IFlashBorrower","name":"borrower","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flashLoan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"bool","name":"balance","type":"bool"},{"internalType":"uint256","name":"maxChangeAmount","type":"uint256"}],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"masterContractApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"masterContractOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"name":"pendingStrategy","outputs":[{"internalType":"contract IStrategy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permitToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"registerProtocol","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"masterContract","type":"address"},{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"setMasterContractApproval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"contract IStrategy","name":"newStrategy","type":"address"}],"name":"setStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint64","name":"targetPercentage_","type":"uint64"}],"name":"setStrategyTargetPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"name":"strategy","outputs":[{"internalType":"contract IStrategy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"name":"strategyData","outputs":[{"internalType":"uint64","name":"strategyStartDate","type":"uint64"},{"internalType":"uint64","name":"targetPercentage","type":"uint64"},{"internalType":"uint128","name":"balance","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"share","type":"uint256"},{"internalType":"bool","name":"roundUp","type":"bool"}],"name":"toAmount","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"roundUp","type":"bool"}],"name":"toShare","outputs":[{"internalType":"uint256","name":"share","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"name":"totals","outputs":[{"internalType":"uint128","name":"elastic","type":"uint128"},{"internalType":"uint128","name":"base","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"share","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address[]","name":"tos","type":"address[]"},{"internalType":"uint256[]","name":"shares","type":"uint256[]"}],"name":"transferMultiple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"},{"internalType":"bool","name":"direct","type":"bool"},{"internalType":"bool","name":"renounce","type":"bool"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"masterContract","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"whitelistMasterContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelistedMasterContracts","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token_","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"share","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"shareOut","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// Contract ABI
const contribotABI = [
  // Contract ABI here
];

// Set the address and instantiate the contract
contribotAddress = "CONTRACT_ADDRESS"

// Set up the provider
const provider = new ethers.providers.JsonRpcProvider("YOUR_JSON_RPC_URL");

// Set up the signer (replace privateKey with the private key of your account)
const privateKey = "YOUR_PRIVATE_KEY";
const signer = new ethers.Wallet(privateKey, provider);

//Instantiate the contract
const contract = new ethers.Contract(contribotAddress, contribotABI, signer);

// Example function calls:

// Get the group state
async function getGroupState() {
  const groupState = await contract.groupState();
  console.log("Group State:", groupState);
}

// Join the group
async function joinGroup(position) {
  const tx = await contract.joinGroup(position);
  await tx.wait();
  console.log("Joined the group");
}

// Leave the group
async function leaveGroup() {
  const tx = await contract.leaveGroup();
  await tx.wait();
  console.log("Left the group");
}

// Deposit donation for a member
async function depositDonation(member) {
  const tx = await contract.depositDonation(member);
  await tx.wait();
  console.log("Deposited donation for member", member);
}

// Claim donations
async function claimDonations(member) {
  const tx = await contract.claimDonations(member);
  await tx.wait();
  console.log("Claimed donations for member", member);
}

// Approve to claim without complete votes
async function approveToClaimWithoutCompleteVotes(member) {
  const tx = await contract.approveToClaimWithoutCompleteVotes(member);
  await tx.wait();
  console.log("Approved to claim without complete votes for member", member);
}

// Deposit funds to BentoBox
async function depositFundsToBentoBox() {
  const tx = await contract.deposit_funds_to_bentoBox();
  await tx.wait();
  console.log("Deposited funds to BentoBox");
}

// Get BentoBox balance
async function getBentoBoxBalance() {
  const balance = await contract.bentoBox_balance();
  console.log("BentoBox balance:", balance);
}

// Withdraw funds from BentoBox
async function withdrawFundsFromBentoBox() {
  const tx = await contract.withdraw_funds_from_bentoBox();
  await tx.wait();
  console.log("Withdrawn funds from BentoBox");
}

// Calculate missed donation for a user
async function calculateMissedDonationForUser(memberAddress) {
  const result = await contract.calculateMissedDonationForUser(memberAddress);
  console.log("Trimmed members who didn't donate for user:", result[0]);
  console.log("Count:", result[1]);
}

// Example function calls
getGroupState();
joinGroup(1);
depositDonation("0xMemberAddress");
claimDonations("0xMemberAddress");
approveToClaimWithoutCompleteVotes("0xMemberAddress");
depositFundsToBentoBox();
getBentoBoxBalance();
withdrawFundsFromBentoBox();
calculateMissedDonationForUser("0xMemberAddress");
