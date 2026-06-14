# Nexus DeFi Staking dApp

A modern decentralized staking application built with React, TypeScript, Vite, Ethers.js, Wagmi, and Framer Motion. Nexus provides an institutional-grade interface for connecting wallets, selecting Ethereum networks, staking assets, monitoring rewards, tracking portfolio metrics, and viewing staking activity.

## 🌐 Live Demo

**Production Deployment:**  
https://nexus-defi-staking-dapp-jg2cb7nxm.vercel.app

---

# Overview

Nexus is a responsive Web3 staking dashboard that enables users to:

- Connect an Ethereum wallet using MetaMask
- Select between Ethereum Mainnet and Sepolia Testnet
- Stake ETH through an intuitive interface
- Unstake assets
- Claim staking rewards
- Enable automatic reward compounding
- Monitor protocol health metrics
- Track portfolio performance
- View staking analytics
- Review transaction history
- Access protocol documentation

The application features a modern glassmorphism-inspired UI with smooth animations powered by Framer Motion.

---

# Features

## 🔗 Wallet Connection

Connect your Ethereum wallet directly from the application.

### Supported Functionality

- MetaMask integration
- Account detection
- Wallet address display
- Connection state management

Connected wallets display a shortened address format:

```text
0x7a62...431e
```

instead of the default Connect Wallet button.

---

## 🌐 Network Selection

The staking dashboard includes a custom network selector.

### Available Networks

| Network | Chain ID |
|----------|----------|
| Ethereum Mainnet | 0x1 |
| Ethereum Sepolia | 0xaa36a7 |

Users can easily switch between supported networks before staking.

---

## 💰 Staking Dashboard

The staking dashboard serves as the primary interaction point for users.

### Stake Assets

Users can:

- Select a network
- Enter a staking amount
- Use the MAX button
- Submit a staking request

### Unstake Assets

Users can:

- Enter an unstake amount
- Withdraw previously staked assets

### Claim Rewards

Users can:

- View accumulated rewards
- Claim pending rewards

### Auto-Compound

Users can enable:

- Automatic reward reinvestment
- Validator diversification
- Daily reward sweeping

---

## 📊 Protocol Health Monitoring

The hero section displays key protocol metrics.

### Metrics Displayed

- Protocol Solvency
- Slashing Coverage
- Oracle Confidence
- Liquidity Buffer
- Validator Set Size
- Epoch Yield

Animated progress bars provide visual insight into protocol health.

---

## 📈 Portfolio Tracking

The portfolio section provides a snapshot of user positions.

### Included Information

- Total staked assets
- Reward balances
- APY exposure
- Asset allocation
- Strategy distribution

---

## 📉 Analytics Dashboard

The analytics section provides visual performance metrics.

### Available Charts

- TVL (Total Value Locked)
- Rewards Growth
- APY History
- User Earnings

The chart architecture is designed for future integration with live blockchain analytics APIs.

---

## 🧾 Transaction History

Users can review staking activity through a detailed transaction log.

### Supported Status Types

- Active
- Pending
- Completed

### Transaction Details

- Transaction type
- Timestamp
- Amount
- Status
- Transaction hash

This creates a transparent and auditable history of protocol activity.

---

## 📚 Documentation Hub

The documentation section provides access to protocol resources.

### Available Resources

- Protocol Documentation
- Risk Framework
- Security Reports

These sections are designed to support future protocol documentation and audit reports.

---

# 🛠 Technology Stack

## Frontend

- React 18
- TypeScript
- Vite

## Web3

- Ethers.js v6
- Wagmi
- RainbowKit

## UI & Animations

- Tailwind CSS
- Framer Motion
- Lucide React

## Deployment

- GitHub
- Vercel

---

# 📂 Project Structure

```text
frontend/
└── nexus-dapp/
    ├── src/
    │   ├── components/
    │   ├── data/
    │   ├── lib/
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── public/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/Sharon-dev-create/Nexus-defi-staking-dapp.git
```

## Navigate to the Frontend

```bash
cd Nexus-defi-staking-dapp/frontend/nexus-dapp
```

## Install Dependencies

```bash
pnpm install
```

## Start Development Server

```bash
pnpm dev
```

Open:

```text
http://localhost:5173
```

---

# 🏗 Build for Production

Generate a production build:

```bash
pnpm build
```

Preview the build locally:

```bash
pnpm preview
```

---

# ⚙ Environment Variables

Create a `.env` file in the project root:

```env
VITE_RPC_URL=https://your-rpc-url
VITE_CHAIN_ID=11155111
```

Example:

```env
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
VITE_CHAIN_ID=11155111
```

---

# ☁ Deployment

## Vercel Deployment

This project is deployed using Vercel.

### Deployment Steps

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the Root Directory:

```text
frontend/nexus-dapp
```

4. Configure environment variables.
5. Deploy the application.

### Live Application

https://nexus-defi-staking-dapp-jg2cb7nxm.vercel.app

---

# ✅ Current Functionality

### Implemented

- Wallet connection with MetaMask
- Ethereum network selection
- Staking interface
- Unstaking interface
- Reward claiming interface
- Auto-compound controls
- Portfolio dashboard
- Analytics dashboard
- Protocol metrics
- Responsive design
- Vercel deployment

---

# 🔮 Future Improvements

### Planned Features

- Smart contract integration
- Live staking transactions
- Real reward calculations
- Wallet network switching
- WalletConnect support
- Multi-chain staking
- Historical analytics
- On-chain transaction verification
- Live APY feeds
- User profile management

---

# 🔒 Security Considerations

This project currently serves as a frontend demonstration of a decentralized staking platform.

Before production deployment, the following should be implemented:

- Smart contract audits
- Transaction validation
- Reentrancy protection
- Slashing protection mechanisms
- Oracle security verification
- Monitoring and alerting systems
- Access control reviews

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Sharon Dev**

### GitHub Repository

https://github.com/Sharon-dev-create/Nexus-defi-staking-dapp

### Live Deployment

https://nexus-defi-staking-dapp-jg2cb7nxm.vercel.app

---

Built with React, TypeScript, Vite, Ethers.js, Wagmi, Tailwind CSS, and Framer Motion to demonstrate a modern decentralized staking experience.