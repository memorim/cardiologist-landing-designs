CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY,
  site text NOT NULL CHECK (site IN ('focus','takt')),
  contact text NOT NULL CHECK (length(contact) BETWEEN 5 AND 254),
  preference text NOT NULL CHECK (preference IN ('morning','afternoon','any')),
  received_at timestamptz NOT NULL DEFAULT now(),
  handled boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS appointment_notification_outbox (
  id uuid PRIMARY KEY REFERENCES appointment_requests(id) ON DELETE CASCADE,
  site text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0,
  lease_until timestamptz NOT NULL DEFAULT '-infinity',
  lease_token uuid,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  last_error text
);
CREATE OR REPLACE FUNCTION enqueue_appointment_notification_outbox() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO appointment_notification_outbox(id,site) VALUES(NEW.id,NEW.site) ON CONFLICT(id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER enqueue_appointment_notification_outbox AFTER INSERT ON appointment_requests
FOR EACH ROW EXECUTE FUNCTION enqueue_appointment_notification_outbox();
