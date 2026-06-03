# ApexBridge Capital — Backend API Specification & Integration Document

This document outlines the database schemas, authentication flows, and API endpoints required to build a fully integrated production backend for **ApexBridge Capital**.

---

## 1. Core Database Schemas

### 1.1 Users (`users`)
Represents an onboarded platform member with their balance and verified credentials.
```json
{
  "id": "varchar(36) [PK]",
  "name": "varchar(255)",
  "email": "varchar(255) [Unique]",
  "password_hash": "varchar(255)",
  "balance": "decimal(18, 2) [Default: 0.00]",
  "phone": "varchar(50) [Nullable]",
  "country": "varchar(100) [Nullable]",
  "wallet_address": "varchar(255) [Nullable]",
  "two_fa_enabled": "boolean [Default: true]",
  "tier": "varchar(50) [Default: 'Tier 2 Private']",
  "created_at": "timestamp"
}
```

### 1.2 Transactions (`transactions`)
Represents deposit notifications, withdrawals, and vault ledger events.
```json
{
  "id": "varchar(36) [PK]",
  "user_id": "varchar(36) [FK -> users.id]",
  "type": "varchar(50)", // "DEPOSIT", "WITHDRAWAL", "DEPLOYMENT", "REVENUE"
  "amount": "decimal(18, 2)",
  "status": "varchar(50)", // "PENDING", "COMPLETED", "FAILED"
  "method": "varchar(100)", // "USDT Tether Protocol (ERC-20)", "USD Wire Transfer", etc.
  "tx_hash": "varchar(255) [Nullable]",
  "created_at": "timestamp"
}
```

### 1.3 Investments / Deployments (`investments`)
Represents dynamic active capital growth vaults selected by the user.
```json
{
  "id": "varchar(36) [PK]",
  "user_id": "varchar(36) [FK -> users.id]",
  "plan_name": "varchar(100)", // "Alpha Bolt", "Global Reserve", "Intelligence Matrix"
  "amount": "decimal(18, 2)",
  "roi": "decimal(5, 2)", // e.g. 18.5 for 18.5%
  "duration": "varchar(50)", // "30 Days", "90 Days", "365 Days"
  "status": "varchar(50)", // "ACTIVE", "COMPLETED", "UNLOCKED"
  "start_date": "timestamp",
  "unlock_date": "timestamp"
}
```

### 1.4 Notifications (`notifications`)
User communications, system warnings, or security alerts.
```json
{
  "id": "varchar(36) [PK]",
  "user_id": "varchar(36) [FK -> users.id]",
  "title": "varchar(255)",
  "message": "text",
  "type": "varchar(50)", // "INFO", "ALERT", "SUCCESS"
  "is_read": "boolean [Default: false]",
  "created_at": "timestamp"
}
```

---

## 2. API Endpoints Specification

All requests should accept and return JSON. Authenticated endpoints require a standard Bearer Token layer (`Authorization: Bearer <JWT_TOKEN>`).

### 2.1 Authentication & Profile Router

#### `POST /api/auth/register`
Onboards an anonymous system user.
* **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "hashed_pass_or_clear",
    "name": "Alexander Gale"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "token": "JWT_TOKEN_STRING",
    "user": {
      "id": "usr_901a8df",
      "name": "ALEXANDER GALE",
      "email": "user@example.com",
      "balance": 10000.00,
      "phone": "+1 (555) 019-2834",
      "country": "United States",
      "walletAddress": "0x71...59"
    }
  }
  ```

#### `POST /api/auth/login`
Authenticates existing credentials.
* **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "cleartext_password"
  }
  ```
* **Success Response (200 OK):** *(Same as registration payload with valid token)*

#### `GET /api/user/profile` [AUTH]
Retrieves live snapshot of the authorized member credentials.
* **Success Response (200 OK):**
  ```json
  {
    "id": "usr_901a8df",
    "name": "ALEXANDER GALE",
    "email": "user@example.com",
    "balance": 10000.00,
    "phone": "+1 (555) 019-2834",
    "country": "United States",
    "walletAddress": "0x71...59",
    "twoFaEnabled": true
  }
  ```

#### `PUT /api/user/profile` [AUTH]
Updates the profile metadata properties.
* **Payload:**
  ```json
  {
    "name": "Alexander Gale",
    "email": "user@example.com",
    "phone": "+1 (555) 019-2834",
    "country": "Switzerland",
    "walletAddress": "0x71C27581B855A5100650A195EAD84CA6762C3A59",
    "twoFaEnabled": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": { ...updatedUserMetadata }
  }
  ```

---

### 2.2 Financial Ledger Router

#### `GET /api/ledger/transactions` [AUTH]
Returns transaction audit history listing.
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "tx_238fa2e",
      "type": "DEPOSIT",
      "amount": 5000.00,
      "status": "COMPLETED",
      "method": "USDT Tether Protocol (ERC-20)",
      "created_at": "2026-06-01T08:50:00Z"
    }
  ]
  ```

#### `POST /api/ledger/deposit` [AUTH]
Submits wire or blockchain transfer notification registry lock.
* **Payload:**
  ```json
  {
    "amount": 2500.00,
    "methodId": "usdt-erc20" // "wire", "usdt-trc20", "usdc-erc20"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "transactionId": "tx_8912fbc3",
    "status": "PENDING",
    "paymentDetails": {
      "depositAddress": "0x2F71B855A5100650A195EAD84CA6762C3A59EAD8",
      "referenceNote": "APX-8912-GALE"
    }
  }
  ```

#### `POST /api/ledger/withdraw` [AUTH]
Creates liquidation allocation request. Requires Multi-Signature verification queue clearance.
* **Payload:**
  ```json
  {
    "amount": 1200.00,
    "targetWallet": "0x71C2...59"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "withdrawalId": "tx_452bda88",
    "status": "PENDING",
    "auditNote": "Multi-sig clearance pending. Expected settlement T+1 cycle."
  }
  ```

---

### 2.3 Vault Growth Deployments

#### `GET /api/vaults/active` [AUTH]
Lists active capital deployment growth packages for user context.
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "growth_98d7fa",
      "planName": "Alpha Bolt",
      "amount": 5000.00,
      "roi": 18.5,
      "duration": "30 Days",
      "status": "ACTIVE",
      "startDate": "2026-05-15T00:00:00Z",
      "unlockDate": "2026-06-15T00:00:00Z"
    }
  ]
  ```

#### `POST /api/vaults/deploy` [AUTH]
Allocates current available profile balance into specific investment plan.
* **Payload:**
  ```json
  {
    "planName": "Alpha Bolt", // Or structural plan code
    "amount": 2500.00
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "deployment": {
      "id": "growth_new882",
      "planName": "Alpha Bolt",
      "amount": 2500.00,
      "roi": 18.5,
      "duration": "30 Days",
      "status": "ACTIVE",
      "startDate": "2026-06-01T09:00:00Z",
      "unlockDate": "2026-07-01T09:00:00Z"
    },
    "newBalance": 7500.00
  }
  ```

---

### 2.4 Notifications Feed

#### `GET /api/notifications` [AUTH]
Retrieves continuous real-time notification records.
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "notf_209a3",
      "title": "System Liquidation Approved",
      "message": "Vault allocation #AlphaBolt has successfully executed return yield cycles.",
      "type": "SUCCESS",
      "createdAt": "2026-06-01T08:00:00Z"
    }
  ]
  ```
