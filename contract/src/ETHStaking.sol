// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ETHStaking is Ownable, ReentrancyGuard, Pausable {
    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 stakedAt;
        uint256 rewardsClaimed;
        bool withdrawn;
    }

    mapping(address => Stake[]) public userStakes;

    uint256 public constant LOCK_PERIOD = 7 days;
    uint256 public constant EARLY_WITHDRAWAL_PENALTY = 10;

    uint256 public constant APR_TIER_1 = 500;
    uint256 public constant APR_TIER_2 = 800;
    uint256 public constant APR_TIER_3 = 1200;

    uint256 public totalStaked;
    uint256 public totalRewardsPaid;
    uint256 public totalPenaltiesCollected;
    uint256 public totalTreasuryWithdrawn;

    bool public emergencyMode;

    event StakeCreated(address indexed user, uint256 stakeId, uint256 amount);
    event RewardClaimed(address indexed user, uint256 stakeId, uint256 reward);
    event StakeWithdrawn(address indexed user, uint256 stakeId, uint256 amount, uint256 reward);
    event PenaltyApplied(address indexed user, uint256 stakeId, uint256 penalty);
    event EmergencyModeEnabled();
    event ContractFunded(uint256 amount);

    modifier whenNotEmergency() {
        require(!emergencyMode, "Emergency mode is active");
        _;
    }

    modifier validStakeId(address user, uint256 stakeId) {
        require(stakeId < userStakes[user].length, "Invalid stake ID");
        _;
    }

    constructor() Ownable(msg.sender) {}

    receive() external payable {}

    function stake() external payable whenNotPaused whenNotEmergency {
        require(msg.value > 0, "Stake amount must be greater than zero");

        uint256 stakeId = userStakes[msg.sender].length;

        userStakes[msg.sender].push(
            Stake({
                stakeId: stakeId,
                amount: msg.value,
                stakedAt: block.timestamp,
                rewardsClaimed: 0,
                withdrawn: false
            })
        );

        totalStaked += msg.value;

        emit StakeCreated(msg.sender, stakeId, msg.value);
    }

    function claimRewards(
        uint256 stakeId
    ) external nonReentrant whenNotPaused whenNotEmergency validStakeId(msg.sender, stakeId) {
        Stake storage userStake = userStakes[msg.sender][stakeId];
        require(!userStake.withdrawn, "Stake already withdrawn");

        uint256 reward = calculateReward(userStake.amount, userStake.stakedAt, userStake.rewardsClaimed);
        require(reward > 0, "No rewards available");
        require(address(this).balance >= totalStaked + reward, "Insufficient reward liquidity");

        userStake.rewardsClaimed += reward;
        totalRewardsPaid += reward;

        _transferETH(msg.sender, reward);

        emit RewardClaimed(msg.sender, stakeId, reward);
    }

    function unstake(
        uint256 stakeId
    ) external nonReentrant whenNotPaused whenNotEmergency validStakeId(msg.sender, stakeId) {
        Stake storage userStake = userStakes[msg.sender][stakeId];
        require(!userStake.withdrawn, "Stake already withdrawn");

        uint256 principal = userStake.amount;
        uint256 reward = calculateReward(principal, userStake.stakedAt, userStake.rewardsClaimed);
        uint256 payout = principal;

        if (block.timestamp < userStake.stakedAt + LOCK_PERIOD) {
            uint256 penalty = (principal * EARLY_WITHDRAWAL_PENALTY) / 100;
            payout = principal - penalty;
            reward = 0;
            totalPenaltiesCollected += penalty;

            emit PenaltyApplied(msg.sender, stakeId, penalty);
        } else {
            require(address(this).balance >= totalStaked + reward, "Insufficient reward liquidity");
            payout = principal + reward;
            userStake.rewardsClaimed += reward;
            totalRewardsPaid += reward;
        }

        userStake.withdrawn = true;
        totalStaked -= principal;

        _transferETH(msg.sender, payout);

        emit StakeWithdrawn(msg.sender, stakeId, principal, reward);
    }

    function emergencyWithdraw(uint256 stakeId) external nonReentrant validStakeId(msg.sender, stakeId) {
        require(emergencyMode, "Emergency mode is not active");

        Stake storage userStake = userStakes[msg.sender][stakeId];
        require(!userStake.withdrawn, "Stake already withdrawn");

        uint256 principal = userStake.amount;

        userStake.withdrawn = true;
        totalStaked -= principal;

        _transferETH(msg.sender, principal);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function enableEmergencyMode() external onlyOwner {
        require(!emergencyMode, "Emergency mode already enabled");
        emergencyMode = true;

        emit EmergencyModeEnabled();
    }

    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Funding amount must be greater than zero");

        emit ContractFunded(msg.value);
    }

    function withdrawTreasury(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than zero");

        uint256 availablePenalties = totalPenaltiesCollected - totalTreasuryWithdrawn;
        require(amount <= availablePenalties, "Amount exceeds available penalty funds");
        require(address(this).balance >= totalStaked + amount, "Insufficient treasury liquidity");

        totalTreasuryWithdrawn += amount;

        _transferETH(owner(), amount);
    }

    function getUserStakes(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }

    function getStakeRewards(address user, uint256 stakeId) external view validStakeId(user, stakeId) returns (uint256) {
        Stake memory userStake = userStakes[user][stakeId];

        if (userStake.withdrawn) {
            return 0;
        }

        return calculateReward(userStake.amount, userStake.stakedAt, userStake.rewardsClaimed);
    }

    function getClaimableRewards(address user, uint256 stakeId) external view validStakeId(user, stakeId) returns (uint256) {
        Stake memory userStake = userStakes[user][stakeId];

        if (userStake.withdrawn) {
            return 0;
        }

        return calculateReward(userStake.amount, userStake.stakedAt, userStake.rewardsClaimed);
    }

    function getTreasuryStats()
        external
        view
        returns (uint256 currentTotalStaked, uint256 currentTotalRewardsPaid, uint256 currentTotalPenaltiesCollected)
    {
        return (totalStaked, totalRewardsPaid, totalPenaltiesCollected);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getAPR(uint256 amount) internal pure returns (uint256) {
        if (amount < 1 ether) {
            return APR_TIER_1;
        }

        if (amount < 5 ether) {
            return APR_TIER_2;
        }

        return APR_TIER_3;
    }

    function calculateReward(
        uint256 amount,
        uint256 stakedAt,
        uint256 rewardsClaimed
    ) internal view returns (uint256) {
        uint256 duration = block.timestamp - stakedAt;
        uint256 apr = getAPR(amount);
        uint256 reward = (amount * apr * duration) / (365 days * 10000);

        if (reward <= rewardsClaimed) {
            return 0;
        }

        return reward - rewardsClaimed;
    }

    function _transferETH(address recipient, uint256 amount) internal {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Transfer amount must be greater than zero");

        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "ETH transfer failed");
    }
}
