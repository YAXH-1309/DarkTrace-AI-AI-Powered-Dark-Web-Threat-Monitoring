# Implementation Plan: DarkTrace AI Dark Web Monitoring

## Overview

This implementation plan breaks down the DarkTrace AI Dark Web Monitoring MVP into actionable coding tasks. The system will be built using Node.js/Express backend, Supabase database, and React frontend with real-time updates. The focus is on creating a functional hackathon MVP with simulated threat intelligence sources, rule-based pattern matching, and a dashboard-centric interface with live updates.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Create backend directory structure (src/models, src/services, src/routes, src/utils)
  - Create frontend directory structure (src/components, src/services, src/hooks)
  - Initialize Node.js project with Express, Supabase driver, and core dependencies
  - Initialize React project with Chart.js/Recharts for visualization
  - Set up Supabase connection configuration
  - Create environment configuration files (.env.example)
  - _Requirements: 1.1, 2.1, 6.1_

- [ ] 2. Create database models and schemas
  - [ ] 2.1 Implement Supabase schemas for DataSources and Threats collections
    - Define DataSource schema with type, url, name, status, lastScanned fields
    - Define Threat schema with organizationId, category, sensitiveData, sourceId, riskLevel fields
    - Add indexes for efficient querying (organizationId, riskLevel, detectedAt)
    - _Requirements: 1.5, 3.1, 4.1_

  - [ ]* 2.2 Write unit tests for schema validation
    - Test required fields validation
    - Test enum value constraints for type, category, riskLevel
    - Test timestamp auto-generation
    - _Requirements: 1.5, 3.1_

- [ ] 3. Implement simulated data sources
  - [ ] 3.1 Create simulated threat intelligence JSON files
    - Generate sample breach data with emails, passwords, API keys
    - Create 3-5 different simulated source files with varied content
    - Include organization domains in sample data for filtering
    - _Requirements: 1.1, 1.3, 11.1_

  - [ ] 3.2 Implement DataSource seeding script
    - Create script to populate DataSources collection with simulated sources
    - Add file path references for local JSON files
    - Set initial status as 'active'
    - _Requirements: 1.2_

- [ ] 4. Build Threat Intelligence Collector service
  - [ ] 4.1 Implement core scanning logic with 30-second intervals
    - Create ThreatIntelligenceCollector class with startScanning/stopScanning methods
    - Use setInterval for 30-second scan cycles
    - Implement scanDataSource method to read from JSON files
    - Store raw collected data with source attribution and timestamp
    - _Requirements: 1.1, 1.3, 1.5_

  - [ ] 4.2 Add retry logic with exponential backoff
    - Implement retryWithBackoff method with 1s, 2s, 4s delays
    - Track retry attempts (max 3)
    - Log errors when max retries exceeded
    - _Requirements: 1.4, 9.1_

  - [ ]* 4.3 Write property test for scan interval compliance
    - **Property 1: Scan Interval Compliance**
    - **Validates: Requirements 1.1**
    - Test that consecutive scans occur within 30-second intervals
    - _Requirements: 1.1_

  - [ ]* 4.4 Write property test for collected data completeness
    - **Property 2: Collected Data Completeness**
    - **Validates: Requirements 1.3, 1.5**
    - Test that all collected data includes content, metadata, source attribution, timestamp
    - _Requirements: 1.3, 1.5_

- [ ] 5. Checkpoint - Verify data collection pipeline
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Build Threat Analyzer service
  - [ ] 6.1 Implement pattern detection methods
    - Create ThreatAnalyzer class with analyzeData method
    - Implement detectEmails using regex for domain matching
    - Implement detectPasswords using regex for password patterns
    - Implement detectAPIKeys using regex for common API key formats
    - Extract context snippets (200 chars) around matches
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

  - [ ] 6.2 Implement threat classification logic
    - Create classifyThreat method to categorize as Credential_Leak, API_Key_Exposure, or Email_Leak
    - Extract and tag relevant keywords from context
    - Identify source type from DataSource metadata
    - Create separate Threat records for multiple data types in same source
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 6.3 Add organization domain filtering
    - Filter detected emails by organization domains
    - Associate threats with correct organizationId
    - Store organization domains in threat record
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 6.4 Write property test for sensitive data detection
    - **Property 3: Sensitive Data Detection**
    - **Validates: Requirements 2.3, 2.4, 2.5**
    - Test that analyzer identifies all credentials, API keys, and emails in sample data
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ]* 6.5 Write property test for threat category classification
    - **Property 4: Threat Category Classification**
    - **Validates: Requirements 3.1**
    - Test that each identified sensitive data is classified into exactly one category
    - _Requirements: 3.1_

  - [ ]* 6.6 Write property test for organization domain filtering
    - **Property 9: Organization Domain Filtering**
    - **Validates: Requirements 11.1, 11.2, 11.3**
    - Test that only threats matching organization domains are associated with that organization
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 7. Build Risk Scorer service
  - [ ] 7.1 Implement risk level assignment logic
    - Create RiskScorer class with assignRiskLevel method
    - Assign High for API_Key_Exposure category
    - Assign Medium for Credential_Leak with email and password
    - Assign Low for Email_Leak or Credential_Leak with email only
    - Calculate numerical score (0-100) based on category
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 7.2 Write property test for risk level assignment rules
    - **Property 5: Risk Level Assignment Rules**
    - **Validates: Requirements 4.2, 4.3, 4.4**
    - Test that risk levels follow the defined classification rules
    - _Requirements: 4.2, 4.3, 4.4_

- [ ] 8. Integrate collection, analysis, and scoring pipeline
  - [ ] 8.1 Wire Collector, Analyzer, and Scorer together
    - Connect ThreatIntelligenceCollector output to ThreatAnalyzer input
    - Connect ThreatAnalyzer output to RiskScorer input
    - Store final Threat records in Supabase Threats collection
    - Update DataSource lastScanned timestamp after each scan
    - _Requirements: 1.5, 2.1, 4.1_

  - [ ] 8.2 Add error handling and logging
    - Wrap each pipeline stage in try-catch blocks
    - Log errors and continue processing other sources
    - Quarantine problematic data when analysis fails
    - Assign default Medium risk level when scoring fails
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 9. Checkpoint - Verify end-to-end threat detection
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Build backend API endpoints
  - [ ] 10.1 Create Express routes for threat data
    - GET /api/threats - List threats with filtering (riskLevel, category, dateRange, sourceType)
    - GET /api/threats/:id - Get single threat details
    - GET /api/threats/stats - Get summary statistics
    - GET /api/threats/trends - Get threat trends over time
    - _Requirements: 6.1, 6.5, 6.7, 6.8_

  - [ ] 10.2 Create Express routes for organization configuration
    - POST /api/organization/domains - Add monitored domains
    - POST /api/organization/keywords - Add custom keywords
    - PUT /api/organization/alert-preferences - Update alert settings
    - GET /api/organization/config - Get current configuration
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 10.3 Implement Server-Sent Events endpoint for real-time updates
    - Create GET /api/threats/stream endpoint with SSE
    - Push new threats to connected clients in real-time
    - Handle client disconnections gracefully
    - _Requirements: 5.1, 6.2_

  - [ ]* 10.4 Write integration tests for API endpoints
    - Test filtering logic for GET /api/threats
    - Test SSE connection and event streaming
    - Test organization configuration updates
    - _Requirements: 6.5, 7.4_

- [ ] 11. Build Alert System
  - [ ] 11.1 Implement alert triggering logic
    - Create AlertSystem class with triggerAlert method
    - Trigger alerts for High risk level threats
    - Push alerts through SSE to connected dashboard clients
    - Include threat details, risk level, source, and recommended actions
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ]* 11.2 Write property test for high risk alert triggering
    - **Property 6: High Risk Alert Triggering**
    - **Validates: Requirements 5.1, 5.2**
    - Test that all High risk threats trigger dashboard alerts
    - _Requirements: 5.1, 5.2_

- [ ] 12. Build React Dashboard frontend
  - [ ] 12.1 Create main Dashboard component structure
    - Set up React Router for navigation
    - Create layout with header, sidebar, and main content area
    - Add organization domain input form
    - _Requirements: 6.1, 11.1_

  - [ ] 12.2 Implement Live Threat Feed component
    - Display threats in descending order by risk level and timestamp
    - Auto-refresh every 5 seconds using polling or SSE
    - Apply color-coded risk indicators (Red/Yellow/Green)
    - Add expand/collapse for threat details
    - _Requirements: 6.1, 6.2, 6.3, 6.7_

  - [ ]* 12.3 Write property test for threat display ordering
    - **Property 7: Threat Display Ordering**
    - **Validates: Requirements 6.1**
    - Test that threats are sorted by risk level then timestamp
    - _Requirements: 6.1_

  - [ ]* 12.4 Write property test for risk level color coding
    - **Property 8: Risk Level Color Coding**
    - **Validates: Requirements 6.3**
    - Test that color indicators match risk levels correctly
    - _Requirements: 6.3_

  - [ ] 12.5 Implement Summary Statistics component
    - Display total threats, high/medium/low counts
    - Show last 24 hours threat count
    - Use visual cards with icons
    - _Requirements: 6.8_

  - [ ] 12.6 Implement Trend Graph component
    - Use Chart.js or Recharts for line chart
    - Display threat frequency over time
    - Add interactive tooltips
    - _Requirements: 6.4, 6.6_

  - [ ] 12.7 Implement Filter Controls component
    - Add dropdowns for risk level, category, date range, source type
    - Apply filters to threat list in real-time
    - Persist filter state in component state
    - _Requirements: 6.5_

  - [ ] 12.8 Implement Alert Popup component
    - Create modal for high-risk threat alerts
    - Display popup notifications when new High risk threats detected
    - Add dismiss action button
    - Optionally play audio alert based on user preferences
    - _Requirements: 5.2, 5.3, 5.5_

  - [ ] 12.9 Connect frontend to backend API
    - Create API service layer for HTTP requests
    - Implement SSE client for real-time updates
    - Handle loading states and error messages
    - _Requirements: 6.2, 5.1_

- [ ] 13. Implement Organization Configuration UI
  - [ ] 13.1 Create configuration form components
    - Add domain input with validation
    - Add custom keywords input
    - Add alert preferences toggle (sound effects)
    - Display current configuration
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ] 13.2 Wire configuration form to backend API
    - POST domain additions to /api/organization/domains
    - POST keyword additions to /api/organization/keywords
    - PUT alert preferences to /api/organization/alert-preferences
    - Show success/error feedback messages
    - _Requirements: 7.4, 7.5_

- [ ] 14. Final integration and polish
  - [ ] 14.1 Test complete end-to-end flow
    - Start backend server and Supabase
    - Seed simulated data sources
    - Start threat collection scanning
    - Verify threats appear in dashboard
    - Test real-time updates and alerts
    - _Requirements: 1.1, 2.1, 5.1, 6.2_

  - [ ] 14.2 Add basic error handling UI
    - Display error messages for failed API requests
    - Show connection status indicator
    - Add retry buttons for failed operations
    - _Requirements: 9.1, 9.2_

  - [ ] 14.3 Polish dashboard UI/UX
    - Ensure responsive design for different screen sizes
    - Add loading spinners for async operations
    - Improve visual hierarchy and spacing
    - Test color contrast for accessibility
    - _Requirements: 6.1, 6.3_

- [ ] 15. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit and integration tests validate specific examples and edge cases
- Focus on dashboard-centric implementation with real-time updates as the primary user interface
- Use simulated JSON files for threat intelligence sources in MVP
- Rule-based pattern matching (regex) simulates "AI-powered" detection for hackathon demo
