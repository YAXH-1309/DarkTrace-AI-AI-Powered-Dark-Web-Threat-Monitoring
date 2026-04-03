-- Supabase SQL Schema for DarkTrace AI

-- DataSources Table
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('simulated_dataset', 'osint_feed', 'breach_database', 'other')),
    url TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'inactive', 'error')),
    last_scanned TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threats Table
CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id VARCHAR(255) NOT NULL,
    organization_domains TEXT[] NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Credential_Leak', 'API_Key_Exposure', 'Email_Leak')),
    sensitive_data_type VARCHAR(50) NOT NULL,
    sensitive_data_value TEXT NOT NULL,
    source_id UUID REFERENCES data_sources(id),
    source_type VARCHAR(50) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    keywords TEXT[] NOT NULL,
    context_snippet TEXT NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('High', 'Medium', 'Low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_threats_org_id ON threats(organization_id);
CREATE INDEX idx_threats_risk_level ON threats(risk_level);
CREATE INDEX idx_threats_detected_at ON threats(detected_at);
