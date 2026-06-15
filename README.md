# Midnight Munch

Midnight Munch is a full-stack, late-night web application designed to streamline food ordering and delivery workflows for university student communities. Built using a Django backend and a React frontend, the platform optimizes transactional efficiency by integrating an automated order-to-delivery data pipeline via WhatsApp API routing. 

Beyond core ordering capabilities, the system incorporates an internal analytical plane that processes transactional data to identify purchasing patterns, consumer trends, and operational bottlenecks.

---

## Key Features

- **Dynamic Inventory & Menu Management:** An interactive frontend displaying real-time item availability, structured pricing structures, and state-driven cart management.
- **Automated Workflow Routing:** Formulates and securely deep-links structured order summaries, customer profiles, and total calculations directly to fulfillment queues over WhatsApp.
- **Data Analytics Engine:** Custom database queries and backend analytics reporting that process transactional records to isolate high-demand items and peak operational hours.
- **Relational Integrity:** A normalized PostgreSQL database schema engineered to maintain strict relational constraints across users, inventory, and historical logs.

---

## Tech Stack & Architecture

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Python, Django REST Framework, FastAPI
- **Database:** PostgreSQL
- **DevOps & Infrastructure:** Docker (Containerized development), Railway (Cloud deployment tracking)

---

## Analytics & Database Insights

The underlying PostgreSQL infrastructure serves as an operational data ledger. Key analytical metrics tracked include:
- **Order Volume Heatmaps:** Time-series analysis identifying specific late-night operational windows with maximum traffic to optimize staffing and supply chains.
- **Conversion Metrics:** Evaluation of user sessions and cart data to calculate conversion rates and cart abandonment behavior.
- **Inventory Velocity:** Analytical auditing of high-turnover food products to generate automated predictive alerts preventing inventory depletion.

---

## Installation & Local Setup

### System Prerequisites
- Python 3.10+
- Node.js (v18+)
- PostgreSQL Instance

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/Meowwwwwwwwwwwwwwwwwwwww/MidnightMunch.git](https://github.com/Meowwwwwwwwwwwwwwwwwwwww/MidnightMunch.git)
cd MidnightMunch/backend

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Execute migrations and start server
python manage.py migrate
python manage.py runserver
