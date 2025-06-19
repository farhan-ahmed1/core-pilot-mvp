# Core Pilot MVP - Product Requirements Document (PRD)

> **Purpose:**  
> Define the functional and non-functional requirements for Core Pilot MVP. This document outlines what the product should do, how it should perform, and what features need to be implemented. For coding guidelines and technical standards, see `/.github/copilot/copilot_instructions.md`.

---

## 1. Product Overview

Core Pilot is an AI-powered academic assistant that helps students break down assignments, manage coursework, and receive intelligent feedback on their work. The MVP focuses on course management, assignment breakdown, and basic feedback capabilities.

### **Target Users**
- Students in academic institutions
- Educators looking for AI-assisted grading tools
- Academic administrators managing coursework

### **Core Value Proposition**
- **AI-Powered Assignment Analysis**: Automatically break down complex assignments into manageable steps
- **Intelligent Feedback**: Receive structured feedback on draft submissions
- **Course Organization**: Centralized management of courses and assignments
- **Progress Tracking**: Visual indicators of assignment completion status

---

## 2. Functional Requirements (FREs)

### **FRE-1: User Authentication & Profile Management**

#### **FRE-1.1 User Registration & Sign In**
- **Description**: Users can create accounts and authenticate using Firebase Auth
- **Acceptance Criteria**:
  - Users can register with email/password
  - Users can sign in with existing credentials
  - User data stored: `uid`, `email`, `displayName`, `created_at` in `users` table
  - Successful authentication redirects to dashboard
  - Failed authentication shows appropriate error messages

#### **FRE-1.2 User Profile Management**
- **Description**: Users can view and edit their profile information
- **Acceptance Criteria**:
  - Users can view current profile (name, email, photo)
  - Users can update display name
  - Users can upload/change profile photo
  - Changes are saved and reflected immediately

### **FRE-2: Course Management**

#### **FRE-2.1 Course CRUD Operations**
- **Description**: Full create, read, update, delete functionality for courses
- **API Endpoints**:
  - `GET /courses` → list all courses for authenticated user
  - `POST /courses` → create new course (fields: `name`, `term`)
  - `PUT /courses/{course_id}` → update course name or term
  - `DELETE /courses/{course_id}` → remove course (cascade delete or require no assignments)
- **Acceptance Criteria**:
  - Courses are user-specific (isolated by authentication)
  - Course creation requires name and term
  - Course updates reflect immediately in UI
  - Course deletion handles assignment dependencies appropriately

### **FRE-3: Assignment Management**

#### **FRE-3.1 Assignment Listing**
- **Description**: Display assignments organized by course
- **API Endpoints**:
  - `GET /courses/{course_id}/assignments` → list assignments under a course
- **Acceptance Criteria**:
  - Assignments display with title, due date, and status
  - Status indicators show: "No draft", "Draft saved", "Feedback ready"
  - Assignments are sortable by due date
  - Empty states handled gracefully

#### **FRE-3.2 Assignment Creation**
- **Description**: Create new assignments with prompts and due dates
- **API Endpoints**:
  - `POST /assignments` → create assignment with `course_id`, `title`, `prompt`, `due_date`
- **Acceptance Criteria**:
  - Assignment creation form includes all required fields
  - Prompt can be entered as text (file upload optional for MVP)
  - Due date validation ensures future dates
  - Created assignments appear immediately in course view

#### **FRE-3.3 Assignment Updates & Deletion**
- **Description**: Edit existing assignments and remove when necessary
- **API Endpoints**:
  - `PUT /assignments/{assignment_id}` → edit title, prompt, or due date
  - `DELETE /assignments/{assignment_id}` → remove assignment
- **Acceptance Criteria**:
  - All assignment fields can be individually updated
  - Updates preserve existing drafts and feedback
  - Deletion requires confirmation
  - Deletion removes associated drafts and feedback

### **FRE-4: AI Assignment Breakdown**

#### **FRE-4.1 Assignment Analysis**
- **Description**: AI-powered breakdown of assignment prompts into actionable steps
- **API Endpoints**:
  - `POST /assignments/{assignment_id}/breakdown`
  - Request body: `{ "prompt": "<string>" }`
  - Response: `{ "summary": "<string>", "outline": ["step 1", "step 2", ...] }`
- **Acceptance Criteria**:
  - AI analyzes assignment prompt and identifies key requirements
  - Returns concise summary of assignment goals
  - Provides numbered list of suggested steps
  - Breakdown displays in assignment view under "AI Breakdown" section
  - Handles API failures gracefully with user-friendly error messages

#### **FRE-4.2 Breakdown Display**
- **Description**: Present AI analysis results in user-friendly format
- **Acceptance Criteria**:
  - Summary displayed prominently with clear formatting
  - Steps presented as numbered list with good visual hierarchy
  - Option to regenerate breakdown if needed
  - Breakdown updates when assignment prompt changes

### **FRE-5: Draft Management & Workspace**

#### **FRE-5.1 Generic Editor Component**
- **Description**: Flexible editor for assignment work
- **Acceptance Criteria**:
  - Single `<Editor />` component accepts plain text or code
  - Initially uses textarea (future: Monaco editor integration)
  - Auto-save drafts every 30 seconds
  - Manual save option available
  - Character/word count display

#### **FRE-5.2 Draft Persistence**
- **Description**: Save and version student work
- **API Endpoints**:
  - `POST /assignments/{assignment_id}/drafts` → save `{ "content": "<string>" }`
  - `GET /assignments/{assignment_id}/drafts` → return all drafts for versioning
- **Database Schema**: `drafts` table with `id`, `assignment_id`, `content`, `submitted_at`
- **Acceptance Criteria**:
  - Drafts saved with timestamp
  - Multiple draft versions maintained
  - Draft loading shows most recent version
  - Draft history accessible (simple list for MVP)

### **FRE-6: AI Feedback System**

#### **FRE-6.1 Feedback Generation**
- **Description**: AI-powered feedback on student drafts
- **API Endpoints**:
  - `POST /assignments/{assignment_id}/drafts/{draft_id}/feedback`
  - Response: `{ "feedback": "<string>", "scores": { "clarity": 3, "depth": 4, ... } }`
- **Database Schema**: `feedback` table with `id`, `draft_id`, `ai_feedback_json`, `created_at`
- **Acceptance Criteria**:
  - Uses fixed rubric with criteria: Clarity, Depth, Organization, Grammar
  - Returns 1-5 scores for each criterion
  - Provides detailed written feedback
  - Feedback stored and retrievable
  - Handles AI service failures gracefully

#### **FRE-6.2 Feedback Display**
- **Description**: Present feedback in clear, actionable format
- **Acceptance Criteria**:
  - Numeric scores displayed with visual indicators (progress bars/stars)
  - Written feedback formatted for readability
  - Feedback appears below draft editor
  - Option to request new feedback on updated drafts
  - Clear timestamp of when feedback was generated

### **FRE-7: Dashboard & Navigation**

#### **FRE-7.1 Course & Assignment Overview**
- **Description**: Central hub for all courses and assignments
- **Navigation**: Default landing page after login (`/dashboard`)
- **Acceptance Criteria**:
  - Displays all user courses in card/grid layout
  - Shows assignment counts and status summaries per course
  - Quick access to create new courses/assignments
  - Recent activity feed
  - Search/filter capabilities for large course lists

#### **FRE-7.2 Navigation Flow**
- **Description**: Intuitive navigation between app sections
- **Acceptance Criteria**:
  - Clicking course leads to course detail view
  - Clicking assignment leads to `/assignments/{assignment_id}` page
  - Assignment page shows: prompt, AI breakdown, editor, feedback
  - Breadcrumb navigation for deep pages
  - Context-aware back buttons

---

## 3. Non-Functional Requirements (NFREs)

### **NFRE-1: Performance**
- **NFRE-1.1**: API endpoints respond within 200ms for simple GET/POST operations (no AI calls)
- **NFRE-1.2**: AI calls (OpenAI) complete within 3 seconds for prompts ≤ 500 tokens
- **NFRE-1.3**: Frontend page loads complete within 2 seconds on standard broadband
- **NFRE-1.4**: Database queries optimized with proper indexing

### **NFRE-2: Scalability**
- **NFRE-2.1**: Backend designed as modular FastAPI services (monolith acceptable for Sprint 0)
- **NFRE-2.2**: SQLAlchemy connection pooling configured
- **NFRE-2.3**: Uvicorn runs with multiple workers (`--workers 4`)
- **NFRE-2.4**: Database schema supports horizontal scaling patterns

### **NFRE-3: Availability & Resilience**
- **NFRE-3.1**: Docker Compose setup with `restart: always` for all services
- **NFRE-3.2**: Graceful handling of OpenAI API failures (return 503 with clear message)
- **NFRE-3.3**: Database connection retry logic with exponential backoff
- **NFRE-3.4**: Frontend error boundaries prevent complete app crashes

### **NFRE-4: Security**
- **NFRE-4.1**: All API endpoints require Firebase JWT authentication
- **NFRE-4.2**: No secrets hard-coded - all use environment variables
- **NFRE-4.3**: SQL injection prevention through SQLAlchemy ORM usage
- **NFRE-4.4**: CORS policy restricts origins (dev: `http://localhost:3000`)
- **NFRE-4.5**: Input validation on all user-submitted data
- **NFRE-4.6**: Rate limiting on AI API endpoints

### **NFRE-5: Data Privacy & Compliance**
- **NFRE-5.1**: Database credentials encrypted at rest
- **NFRE-5.2**: User data deletion cascade (account deletion removes all related data)
- **NFRE-5.3**: AI service calls don't store user data permanently
- **NFRE-5.4**: User consent for AI processing clearly documented

### **NFRE-6: Maintainability**
- **NFRE-6.1**: Python code follows PEP 8 (enforced by flake8, black)
- **NFRE-6.2**: TypeScript strict mode enabled with ESLint + Prettier
- **NFRE-6.3**: Comprehensive docstrings (Python) and JSDoc (TypeScript)
- **NFRE-6.4**: Code organized in logical modules with clear separation of concerns
- **NFRE-6.5**: Database migrations managed through Alembic
- **NFRE-6.6**: Environment-specific configuration management

### **NFRE-7: Usability & Accessibility**
- **NFRE-7.1**: UI follows WCAG 2.1 AA accessibility guidelines
- **NFRE-7.2**: Forms include proper labels, error messages, keyboard navigation
- **NFRE-7.3**: Responsive design works on mobile and desktop
- **NFRE-7.4**: Loading states and progress indicators for long operations
- **NFRE-7.5**: Consistent UI patterns across all pages
- **NFRE-7.6**: Error messages are user-friendly and actionable

### **NFRE-8: Internationalization**
- **NFRE-8.1**: UI strings externalized to support future localization
- **NFRE-8.2**: Date/time formatting locale-aware
- **NFRE-8.3**: Text input fields support Unicode characters

---

## 4. Technical Implementation Details

### **AI Prompt Templates**
Located in `backend/utils/ai_prompts.py`:

#### **Assignment Breakdown Template**:
```text
"You are an academic assistant. Given the assignment prompt below, identify key requirements and produce a concise summary and a bullet-point outline of suggested steps. Prompt: '{PROMPT_TEXT}'"
```

#### **Draft Feedback Template**:
```text
"You are an AI grader. The following is a student's draft. Provide feedback under these rubric criteria: Clarity, Depth, Organization, Grammar. Return JSON: {'clarity': <score 1–5>, 'depth': <score>, 'organization': <score>, 'grammar': <score>, 'comments': 'Detailed feedback text…'}. Draft: '{DRAFT_TEXT}'"
```

### **Environment Configuration**

#### **Backend Environment Variables**:
```
DATABASE_URL=postgresql://corepilot:corepilot_pass@postgres:5432/corepilot_db
FIREBASE_PROJECT_ID=<your-firebase-project>
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY=<service-account-private_key>
OPENAI_API_KEY=<your-openai-key>
JWT_SECRET=<random-string>
```

#### **Frontend Environment Variables**:
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
```

---

## 5. Sprint 0 Scope & Deliverables

### **Sprint 0 Goals**
Focus on foundation and scaffolding rather than full feature implementation.

### **Backend Deliverables**
1. **Authentication Stub**: Firebase token verification middleware
2. **Course CRUD Stubs**: Basic endpoints (`GET /health`, `GET /courses`, `POST /courses`)
3. **Assignment CRUD Stubs**: Basic endpoints (`GET /courses/{id}/assignments`, `POST /assignments`)
4. **AI Breakdown Stub**: `POST /assignments/{id}/breakdown` returns mock outline
5. **Draft CRUD Stub**: `POST /assignments/{id}/drafts` stores dummy content
6. **Feedback Stub**: `POST /assignments/{id}/drafts/{id}/feedback` returns mock JSON
7. **Database Models**: SQLAlchemy models for all entities
8. **Docker Setup**: Compose file with Postgres and backend service

### **Frontend Deliverables**
1. **Authentication Pages**: LoginPage with Firebase Auth integration
2. **Main Navigation**: DashboardPage with course listing
3. **Assignment Interface**: AssignmentPage showing prompt, breakdown area, editor stub
4. **Basic Components**: CourseCard, AssignmentList, Header, Sidebar
5. **Routing Setup**: React Router configuration
6. **Material UI Theme**: Basic theme configuration
7. **API Integration**: Service layer for backend communication

### **Quality Standards for Sprint 0**
1. **Performance**: Stub endpoints respond < 200ms
2. **Scalability**: Uvicorn with 4 workers configured
3. **Availability**: Docker Compose with restart policies
4. **Security**: CORS configured for localhost:3000, basic token verification
5. **Maintainability**: Proper folder structure, linting configuration
6. **Usability**: Material UI components with ARIA labels
7. **I18n Ready**: Basic i18n setup with key strings externalized

---

## 6. Success Metrics

### **Sprint 0 Acceptance Criteria**
- [ ] All API stubs return appropriate mock data
- [ ] Frontend pages render without errors
- [ ] Authentication flow works end-to-end
- [ ] Docker Compose brings up all services
- [ ] Basic navigation functions correctly
- [ ] Code passes all linting checks
- [ ] File size constraints maintained (< 500 lines per file)

### **Future Success Metrics** (Post-MVP)
- User engagement: Time spent per session
- Feature adoption: % users using AI breakdown/feedback
- Performance: 95th percentile response times
- User satisfaction: NPS scores from academic users

---

## 7. Dependencies & Assumptions

### **External Dependencies**
- **OpenAI API**: GPT-4/GPT-4 Turbo availability and rate limits
- **Firebase Auth**: Service reliability and token validation
- **PostgreSQL**: Database hosting and backup strategies

### **Technical Assumptions**
- Users have modern browsers supporting ES6+
- Network connectivity sufficient for real-time features
- AI responses provide sufficient quality for academic feedback
- Database schema supports future feature expansion

### **Business Assumptions**
- Academic institutions interested in AI-assisted tools
- Students comfortable with AI feedback on their work
- Educators willing to integrate AI tools in curriculum
- Regulatory compliance requirements manageable for AI in education