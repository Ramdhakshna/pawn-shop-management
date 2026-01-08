# Pawn Shop Management System

A comprehensive web application for managing pawn shop operations including customer management, gold and silver loan records, and automated interest computation.

## Features

- **Customer Management**: Full CRUD operations for customer data (name, mobile, address, Aadhar card number)
- **Loan Management**: Create and manage gold and silver loans with detailed ornament information
- **Payment Tracking**: Record and track payments (interest, principal, or full payments)
- **Interest Calculation**: Automated interest calculation with monthly accrual and yearly capitalization
- **Reports**: View detailed loan reports with interest history and payment records

## Interest Calculation Logic

- **Gold Loans**: 2% per month
- **Silver Loans**: 3% per month
- Interest is calculated monthly on a simple basis for the first 12 months
- At the end of every 12-month cycle, accumulated interest is capitalized (added to principal)
- Subsequent interest calculations are performed on the updated principal
- This results in a yearly compounding model with monthly accrual

## Setup for GitHub Pages

### Option 1: Quick Deploy (Recommended)

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it anything you like (e.g., `pawn-shop-management`)

2. **Upload Files**
   - Upload all files (`index.html`, `styles.css`, `app.js`) to the root of your repository
   - You can do this via GitHub web interface or using Git commands

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access Your Application**
   - Your application will be available at: `https://[your-username].github.io/[repository-name]`
   - It may take a few minutes for the site to be available

### Option 2: Using Git Commands

```bash
# Clone your repository (replace with your repository URL)
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Copy all project files to this directory
# (index.html, styles.css, app.js, README.md)

# Add and commit files
git add .
git commit -m "Initial commit: Pawn Shop Management System"

# Push to GitHub
git push origin main

# Then enable GitHub Pages from repository settings as described above
```

## Local Usage

You can also run this application locally:

1. **Download all files** to a folder on your computer
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari)
3. The application will work completely offline using localStorage for data storage

## Data Storage

### Two Storage Options:

#### 1. Local Storage (Default)
- All data stored in your browser using **localStorage**
- Data persists between browser sessions
- Data is specific to each browser/device
- Works completely offline

#### 2. GitHub Storage (Cross-Device Sync) ⭐ NEW!
- Data stored in your GitHub repository
- **Sync across all your devices** (desktop, mobile, tablet)
- Automatic backup in GitHub
- Access from anywhere
- See [GITHUB_STORAGE_SETUP.md](GITHUB_STORAGE_SETUP.md) for setup instructions

**Switch between modes anytime via Settings (⚙️) button**

## Browser Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari - latest versions)
- JavaScript enabled
- No additional dependencies or installations required

## Usage Guide

### Adding a Customer
1. Click on "Customers" tab
2. Click "+ Add Customer"
3. Fill in customer details (name, mobile, address, Aadhar number)
4. Click "Save"

### Creating a Loan
1. Click on "Loans" tab
2. Click "+ Add Loan"
3. Select customer, enter bill number, loan type (gold/silver)
4. Enter ornament details in grams and principal amount
5. Select start date
6. Click "Save"

### Recording a Payment
1. Click on "Payments" tab
2. Click "+ Add Payment"
3. Select the loan (by bill number)
4. Choose payment type (interest, principal, or full payment)
5. Enter amount and date
6. Click "Save"

### Viewing Reports
1. Click on "Reports" tab
2. Select a loan from the dropdown
3. View detailed information including:
   - Loan statistics
   - Interest history with capitalization events
   - Payment history

## File Structure

```
pawn-shop-management/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── app.js             # Application logic and data management
└── README.md          # This file
```

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Data Storage**: Browser localStorage
- **Responsive**: Works on desktop and mobile devices
- **No Backend**: Fully client-side application

## Example Interest Calculation

### Gold Loan Example:
- **Principal**: ₹100,000
- **Rate**: 2% per month
- **Year 1** (Months 1-12): 
  - Monthly Interest: ₹2,000
  - Total Interest: ₹24,000
  - **Capitalized**: New Principal = ₹124,000
- **Year 2** (Months 13-24):
  - Monthly Interest: ₹2,480
  - Total Interest: ₹29,760
  - **Final Outstanding**: ₹153,760

## Support

For issues or questions, please check the code comments or create an issue in the GitHub repository.

## License

This project is open source and available for personal and commercial use.