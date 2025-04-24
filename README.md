# 💸 E-Rupee: Secure and Accountable Payments

E-Rupee is a modern digital payment solution that allows users to transfer money securely using QR codes or usernames. A unique feature of this app is the **Extra Balance** system, which promotes transparency in conditional fund usage—ideal for NGOs, scholarship disbursals, and medical aid.

---

## 🚀 Features

### 🔐 Authentication
- Two-step registration and login with email OTP and password.
- Secure JWT-based session management.

### 💰 Payment Modes
- **Normal Transfer**: Transfer money using username or QR code.
- **Extra Balance Transfer**: Funds sent with a *specific purpose* (e.g., scholarship). The receiver must request approval before spending.

### ✅ Extra Balance Logic
- **Sender A** sends ₹10,000 to **Receiver B** under "Extra Balance" for a purpose like *education*.
- When **B** tries to use this amount, a **permission request** is sent to **A**.
- **A** can approve or reject this request. If approved, the amount is credited to the intended receiver.
- This ensures **controlled spending** and **donor transparency**.

### 📊 Transactions and Requests
- View complete transaction history.
- Track all pending approval requests related to extra balances.

### 📎 QR Code Support
- Generate and scan QR codes for easy user payments.

---

## 📂 Backend API (Node.js + Express)

### Auth APIs
- `POST /user/register-step1` → Send OTP to email
- `POST /user/register-step2` → Complete registration with OTP and password
- `POST /user/login-step1` → Initiate login with OTP
- `POST /user/login-step2` → Login with OTP + password

### Payment APIs
- `POST /transfer` → Normal or Extra transfer
- `POST /permission_extra_bal` → Receiver requests to spend extra balance
- `PUT /pending_request` → Original sender approves/rejects request

### Utility APIs
- `GET /getbalance` → Get current balance and email
- `GET /getbalance/Extra` → Get extra balances received
- `GET /getTransactions` → View all transactions
- `GET /getPendingReq` → View requests needing your approval
- `POST /qr_generator` → Generate QR code for user

---

## 🧪 Tech Stack

| Layer       | Tech                       |
|-------------|----------------------------|
| Frontend    | React + Vite               |
| Backend     | Node.js + Express.js       |
| Auth        | JWT, Bcrypt, OTP (Nodemailer) |
| Database    | MySQL                      |
| QR Handling | `qrcode` npm package       |

---

## 🔧 How to Run Locally

### Backend

```bash
cd backend
npm install
node index.js
```

Make sure your MySQL server is running and the database schema is set up accordingly.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Use Cases

- **NGOs** managing conditional aid disbursal.
- **Educational institutions** offering monitored scholarships.
- **Medical financial aid** requiring real-time usage approvals.

---

## 📌 Future Enhancements

- Push notifications for approvals.
- Dashboard for donors to track fund utilization.
- Mobile app version.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📫 Contact

For queries or collaboration, reach out to [Vyankatesh Kulkarni](https://github.com/VyankateshKulkarni06)
