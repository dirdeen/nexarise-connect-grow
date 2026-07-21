![NexaRise preview](docs/assets/github-preview.png)
# NexaRise

> **An open-source employment, mentorship, career development, and verified workforce platform for Sierra Leone.**

NexaRise is designed to bridge the gap between talent and opportunity by providing a trusted digital platform where students, graduates, professionals, employers, mentors, and organizations can connect, grow, and build meaningful careers.

The platform supports employment discovery, mentorship, workforce verification, professional networking, and career development while promoting digital inclusion and economic growth across Sierra Leone.

---

## 🌍 Vision

To build Sierra Leone's most trusted digital workforce ecosystem that empowers people to learn, work, connect, and thrive.

---

## 🎯 Mission

NexaRise aims to make employment and career opportunities accessible to everyone by providing an open, secure, and scalable platform for workforce development.

---

# ✨ Features

Current features include:

- 🔐 Secure Authentication
- 👤 Professional User Profiles
- 💼 Job Listings
- 🏢 Employer Dashboard
- 🎓 Career Development Resources
- 🤝 Mentorship Matching
- ✅ Workforce Verification
- 📁 Resume & Portfolio Management
- ☁️ Secure File Storage
- 📱 Mobile Responsive Design

Planned features include:

- AI Career Assistant
- Learning Path Recommendations
- Skill Assessments
- Internship Marketplace
- Professional Certifications
- Analytics Dashboard
- Mobile Application

See the **Roadmap** documentation for upcoming releases.

---

# 📚 Documentation

Comprehensive project documentation is available in the **docs/** directory.

Documentation includes:

- Project Audit
- Product Roadmap
- Backend Implementation Plan
- Architecture Overview
- Database Design
- API Documentation
- Deployment Guide
- Supabase Setup Guide
- Security Documentation
- Testing Report
- Development Guidelines

These documents provide sufficient information for developers unfamiliar with the project to deploy, configure, maintain, and extend the platform.

---

# 📂 Repository Structure

```text
.
├── .github/
│   └── workflows/               # GitHub Actions
│
├── docs/                        # Technical documentation
│   ├── Project-Audit.md
│   ├── Roadmap.md
│   ├── Backend-Implementation.md
│   ├── Deployment-Guide.md
│   ├── Supabase-Setup.md
│   ├── Test-Report.md
│   └── Architecture.md
│
├── public/                      # Static assets
├── scripts/                     # Deployment & verification scripts
├── src/                         # Application source code
├── supabase/                    # Database migrations & Edge Functions
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🏗 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS

## Backend

- Supabase
- PostgreSQL
- Authentication
- Storage
- Edge Functions

## Deployment

- Vercel
- GitHub Actions

---

# 🚀 Local Development

## Prerequisites

Install:

- Node.js (LTS)
- pnpm
- Git

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/NexaRise.git

cd NexaRise
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Configure Environment Variables

Copy the environment template.

```bash
cp .env.example .env
```

Configure the following variables.

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Additional configuration options are documented in the deployment guide.

---

## Start Development Server

```bash
pnpm run dev
```

Application URL:

```
http://localhost:5173
```

---

# 🗄 Database

NexaRise uses **Supabase PostgreSQL**.

Database functionality includes:

- Authentication
- User Profiles
- Job Listings
- Mentorship Data
- Workforce Verification
- Storage Buckets
- Edge Functions

Database migrations are located in:

```
supabase/
```

---

# 🧪 Testing

Run lint checks.

```bash
pnpm lint
```

Run type checking.

```bash
pnpm typecheck
```

Create a production build.

```bash
pnpm build
```

Run local verification.

```bash
./scripts/verify-local.sh
```

Testing procedures are documented in:

```
docs/Test-Report.md
```

---

# 🚀 Deployment

Production deployments are handled using **Vercel**.

Before deployment ensure:

- Environment variables are configured
- Verification passes
- Production build succeeds

Deploy manually:

```bash
./scripts/deploy-vercel.sh
```

Deployment instructions are available in:

```
docs/Deployment-Guide.md
```

---

# 🔒 Security

NexaRise follows modern web security practices including:

- Secure Authentication
- Environment Variable Isolation
- HTTPS Deployment
- Row Level Security (Supabase)
- Secure File Storage
- Protected API Access

Additional security documentation can be found in the **docs/** folder.

---

# 🤝 Contributing

We welcome community contributions.

Before contributing:

1. Fork the repository.
2. Create a feature branch.
3. Follow the project's coding standards.
4. Run verification scripts.
5. Submit a Pull Request.

For major changes, please open an Issue first to discuss your proposal.

---

# 🛣 Roadmap

Upcoming milestones include:

- AI Career Assistant
- Employer Verification
- Mobile Application
- Learning Marketplace
- Recommendation Engine
- Analytics Dashboard
- Public API
- Multi-language Support

See the Roadmap document for detailed milestones.

---

# 🏛 Architecture

NexaRise follows a modern cloud-native architecture.

Core components include:

- React Frontend
- TanStack Router
- Supabase Authentication
- PostgreSQL Database
- Storage Buckets
- Edge Functions
- Vercel Hosting

Detailed architecture diagrams and technical specifications are available in the documentation.

---

# 🌍 Digital Public Good Alignment

NexaRise is developed as an open-source platform to strengthen employment and workforce development in Sierra Leone.

The project provides:

- Open source code
- Technical documentation
- Deployment documentation
- Functional requirements
- Development guides
- Architecture documentation
- Configuration reference

This documentation enables developers unfamiliar with the project to deploy, maintain, and extend the software.

---

# 💬 Support

For support:

- Open a GitHub Issue
- Review the documentation in `docs/`
- Contact the project maintainers

---

# 📄 License

Copyright © 2026 NexaRise Contributors.

Licensed under the Apache License, Version 2.0.

You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an **"AS IS" BASIS**, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the **LICENSE** file for the specific language governing permissions and limitations under the License.

---

# 🙏 Acknowledgements

NexaRise is built with the support of the global open-source community and the maintainers of the technologies that power the platform, including React, Vite, TanStack Router, Tailwind CSS, Supabase, PostgreSQL, and Vercel.

We thank all contributors, developers, educators, employers, mentors, organizations, and community members working to create more accessible employment and career opportunities across Sierra Leone.

Every contribution, whether through code, documentation, testing, or feedback, helps strengthen the platform and its impact.