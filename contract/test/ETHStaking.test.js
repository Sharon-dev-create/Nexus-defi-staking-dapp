import { expect } from "chai";
import { network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = await network.create();

const LOCK_PERIOD = 7n * 24n * 60n * 60n;
const YEAR = 365n * 24n * 60n * 60n;
const APR_TIER_2 = 800n;

function calculateExpectedReward(amount, apr, duration) {
  return (amount * apr * duration) / (YEAR * 10000n);
}

async function deployETHStaking() {
  const [owner, user, otherUser] = await ethers.getSigners();
  const staking = await ethers.deployContract("ETHStaking");

  return { staking, owner, user, otherUser };
}

async function latestTimestamp() {
  return BigInt(await time.latest());
}

describe("ETHStaking", function () {
  describe("stake()", function () {
    it("creates a stake successfully", async function () {
      const { staking, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");

      await expect(staking.connect(user).stake({ value: amount }))
        .to.emit(staking, "StakeCreated")
        .withArgs(user.address, 0, amount);

      const userStake = await staking.userStakes(user.address, 0);

      expect(userStake.stakeId).to.equal(0n);
      expect(userStake.amount).to.equal(amount);
      expect(userStake.rewardsClaimed).to.equal(0n);
      expect(userStake.withdrawn).to.equal(false);
      expect(await staking.totalStaked()).to.equal(amount);
    });

    it("reverts when staking zero ETH", async function () {
      const { staking, user } = await deployETHStaking();

      await expect(staking.connect(user).stake({ value: 0 })).to.be.revertedWith(
        "Stake amount must be greater than zero",
      );
    });

    it("reverts when paused", async function () {
      const { staking, user } = await deployETHStaking();

      await staking.pause();

      await expect(staking.connect(user).stake({ value: ethers.parseEther("1") })).to.be.revertedWithCustomError(
        staking,
        "EnforcedPause",
      );
    });
  });

  describe("calculateReward()", function () {
    it("accumulates rewards correctly over time", async function () {
      const { staking, owner, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");
      const duration = 30n * 24n * 60n * 60n;

      await staking.connect(owner).fundContract({ value: ethers.parseEther("1") });
      await staking.connect(user).stake({ value: amount });

      const userStake = await staking.userStakes(user.address, 0);
      await time.increase(duration);

      const currentTimestamp = await latestTimestamp();
      const expectedReward = calculateExpectedReward(amount, APR_TIER_2, currentTimestamp - userStake.stakedAt);

      expect(await staking.getStakeRewards(user.address, 0)).to.equal(expectedReward);
      expect(await staking.getClaimableRewards(user.address, 0)).to.equal(expectedReward);
    });
  });

  describe("claimRewards()", function () {
    it("claims rewards and updates rewardsClaimed correctly", async function () {
      const { staking, owner, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");

      await staking.connect(owner).fundContract({ value: ethers.parseEther("1") });
      await staking.connect(user).stake({ value: amount });

      const userStakeBefore = await staking.userStakes(user.address, 0);
      await time.increase(30n * 24n * 60n * 60n);

      const tx = await staking.connect(user).claimRewards(0);
      const receipt = await tx.wait();
      const claimBlock = await ethers.provider.getBlock(receipt.blockNumber);
      const expectedReward = calculateExpectedReward(
        amount,
        APR_TIER_2,
        BigInt(claimBlock.timestamp) - userStakeBefore.stakedAt,
      );

      const userStakeAfter = await staking.userStakes(user.address, 0);

      expect(userStakeAfter.rewardsClaimed).to.equal(expectedReward);
      expect(await staking.totalRewardsPaid()).to.equal(expectedReward);
    });
  });

  describe("unstake()", function () {
    it("applies a 10% penalty on early withdrawal", async function () {
      const { staking, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");
      const penalty = ethers.parseEther("0.1");
      const payout = ethers.parseEther("0.9");

      await staking.connect(user).stake({ value: amount });

      const contractBalanceBefore = await ethers.provider.getBalance(staking.target);

      await expect(staking.connect(user).unstake(0))
        .to.emit(staking, "PenaltyApplied")
        .withArgs(user.address, 0, penalty);

      const contractBalanceAfter = await ethers.provider.getBalance(staking.target);
      const userStake = await staking.userStakes(user.address, 0);

      expect(contractBalanceAfter).to.equal(contractBalanceBefore - payout);
      expect(userStake.withdrawn).to.equal(true);
      expect(await staking.totalStaked()).to.equal(0n);
      expect(await staking.totalPenaltiesCollected()).to.equal(penalty);
    });

    it("returns full principal plus rewards after the lock period", async function () {
      const { staking, owner, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");

      await staking.connect(owner).fundContract({ value: ethers.parseEther("1") });
      await staking.connect(user).stake({ value: amount });

      const userStakeBefore = await staking.userStakes(user.address, 0);
      await time.increaseTo(userStakeBefore.stakedAt + LOCK_PERIOD + 1n);

      const contractBalanceBefore = await ethers.provider.getBalance(staking.target);
      const tx = await staking.connect(user).unstake(0);
      const receipt = await tx.wait();
      const withdrawBlock = await ethers.provider.getBlock(receipt.blockNumber);
      const expectedReward = calculateExpectedReward(
        amount,
        APR_TIER_2,
        BigInt(withdrawBlock.timestamp) - userStakeBefore.stakedAt,
      );

      const contractBalanceAfter = await ethers.provider.getBalance(staking.target);
      const userStakeAfter = await staking.userStakes(user.address, 0);

      expect(contractBalanceAfter).to.equal(contractBalanceBefore - amount - expectedReward);
      expect(userStakeAfter.withdrawn).to.equal(true);
      expect(userStakeAfter.rewardsClaimed).to.equal(expectedReward);
      expect(await staking.totalStaked()).to.equal(0n);
      expect(await staking.totalRewardsPaid()).to.equal(expectedReward);
    });
  });

  describe("pause()/unpause()", function () {
    it("allows only the owner to pause and unpause", async function () {
      const { staking, user } = await deployETHStaking();

      await expect(staking.connect(user).pause())
        .to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount")
        .withArgs(user.address);

      await staking.pause();
      expect(await staking.paused()).to.equal(true);

      await expect(staking.connect(user).unpause())
        .to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount")
        .withArgs(user.address);

      await staking.unpause();
      expect(await staking.paused()).to.equal(false);
    });

    it("disables staking while paused and allows staking after unpause", async function () {
      const { staking, user } = await deployETHStaking();

      await staking.pause();

      await expect(staking.connect(user).stake({ value: ethers.parseEther("1") })).to.be.revertedWithCustomError(
        staking,
        "EnforcedPause",
      );

      await staking.unpause();
      await staking.connect(user).stake({ value: ethers.parseEther("1") });

      expect(await staking.totalStaked()).to.equal(ethers.parseEther("1"));
    });
  });

  describe("enableEmergencyMode()", function () {
    it("allows only the owner to enable emergency mode", async function () {
      const { staking, user } = await deployETHStaking();

      await expect(staking.connect(user).enableEmergencyMode())
        .to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount")
        .withArgs(user.address);

      await expect(staking.enableEmergencyMode()).to.emit(staking, "EmergencyModeEnabled");
      expect(await staking.emergencyMode()).to.equal(true);
    });

    it("allows emergency withdrawals with no rewards and no penalty", async function () {
      const { staking, owner, user } = await deployETHStaking();
      const amount = ethers.parseEther("1");

      await staking.connect(owner).fundContract({ value: ethers.parseEther("1") });
      await staking.connect(user).stake({ value: amount });
      await time.increase(30n * 24n * 60n * 60n);
      await staking.connect(owner).enableEmergencyMode();

      const contractBalanceBefore = await ethers.provider.getBalance(staking.target);

      await staking.connect(user).emergencyWithdraw(0);

      const contractBalanceAfter = await ethers.provider.getBalance(staking.target);
      const userStake = await staking.userStakes(user.address, 0);

      expect(contractBalanceAfter).to.equal(contractBalanceBefore - amount);
      expect(userStake.withdrawn).to.equal(true);
      expect(userStake.rewardsClaimed).to.equal(0n);
      expect(await staking.totalStaked()).to.equal(0n);
      expect(await staking.totalPenaltiesCollected()).to.equal(0n);
      expect(await staking.totalRewardsPaid()).to.equal(0n);
    });
  });
});
