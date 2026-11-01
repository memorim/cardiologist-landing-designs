CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY,
  site text NOT NULL CHECK (site IN ('focus','takt')),
  contact text NOT NULL CHECK (length(contact) BETWEEN 5 AND 254),
  preference text NOT NULL CHECK (preference IN ('morning','afternoon','any')),
  received_at timestamptz NOT NULL DEFAULT now(),
  handled boolean NOT NULL DEFAULT false
);
