-- ============================================================================
-- COMMUNITY & ENGAGEMENT SCHEMA
-- ============================================================================
-- Events, Challenges, and Member Directory tables

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  event_type character varying DEFAULT 'webinar'::character varying CHECK (event_type::text = ANY (ARRAY['webinar'::character varying, 'workshop'::character varying, 'live_qna'::character varying, 'challenge'::character varying, 'meetup'::character varying]::text[])),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  timezone character varying DEFAULT 'UTC'::character varying,
  registration_url text,
  meeting_url text, -- Zoom/Google Meet link
  max_participants integer,
  current_participants integer DEFAULT 0,
  featured_image text,
  host_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  host?: Profile; -- Joined
  status character varying DEFAULT 'upcoming'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'upcoming'::character varying, 'live'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  registration_open boolean DEFAULT true,
  registration_deadline timestamp with time zone,
  price numeric DEFAULT 0,
  currency character varying DEFAULT 'USD'::character varying,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- EVENT REGISTRATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  registration_date timestamp with time zone DEFAULT now(),
  attendance_status character varying DEFAULT 'registered'::character varying CHECK (attendance_status::text = ANY (ARRAY['registered'::character varying, 'attended'::character varying, 'no_show'::character varying, 'cancelled'::character varying]::text[])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  UNIQUE (event_id, user_id)
);

-- ============================================================================
-- CHALLENGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  challenge_type character varying DEFAULT 'content'::character varying CHECK (challenge_type::text = ANY (ARRAY['content'::character varying, 'growth'::character varying, 'monetization'::character varying, 'skill'::character varying]::text[])),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  duration_days integer,
  difficulty_level character varying DEFAULT 'beginner'::character varying CHECK (difficulty_level::text = ANY (ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying]::text[])),
  featured_image text,
  rules text[],
  prizes text[],
  requirements text[],
  leaderboard_enabled boolean DEFAULT true,
  max_participants integer,
  current_participants integer DEFAULT 0,
  status character varying DEFAULT 'upcoming'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'upcoming'::character varying, 'active'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  registration_open boolean DEFAULT true,
  registration_deadline timestamp with time zone,
  created_by uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenges_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- CHALLENGE PARTICIPATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.challenge_participations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  registration_date timestamp with time zone DEFAULT now(),
  completion_status character varying DEFAULT 'in_progress'::character varying CHECK (completion_status::text = ANY (ARRAY['registered'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'dropped'::character varying]::text[])),
  progress_percentage integer DEFAULT 0,
  submissions jsonb, -- Array of submission objects
  points integer DEFAULT 0,
  rank integer,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenge_participations_pkey PRIMARY KEY (id),
  UNIQUE (challenge_id, user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS events_start_date_idx ON public.events(start_date);
CREATE INDEX IF NOT EXISTS events_status_idx ON public.events(status);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON public.events(event_type);
CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS event_registrations_user_id_idx ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS challenges_start_date_idx ON public.challenges(start_date);
CREATE INDEX IF NOT EXISTS challenges_status_idx ON public.challenges(status);
CREATE INDEX IF NOT EXISTS challenge_participations_challenge_id_idx ON public.challenge_participations(challenge_id);
CREATE INDEX IF NOT EXISTS challenge_participations_user_id_idx ON public.challenge_participations(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published events" ON public.events;
CREATE POLICY "Anyone can read published events" ON public.events FOR SELECT USING (status IN ('upcoming', 'live'));
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid() = host_id);

-- Event Registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Authenticated users can register for events" ON public.event_registrations;
CREATE POLICY "Authenticated users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own registrations" ON public.event_registrations;
CREATE POLICY "Users can update own registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published challenges" ON public.challenges;
CREATE POLICY "Anyone can read published challenges" ON public.challenges FOR SELECT USING (status IN ('upcoming', 'active'));
DROP POLICY IF EXISTS "Authenticated users can create challenges" ON public.challenges;
CREATE POLICY "Authenticated users can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can update own challenges" ON public.challenges;
CREATE POLICY "Users can update own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = created_by);

-- Challenge Participations
ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own participations" ON public.challenge_participations;
CREATE POLICY "Users can view own participations" ON public.challenge_participations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.challenge_participations;
CREATE POLICY "Anyone can view leaderboard" ON public.challenge_participations FOR SELECT USING (true); -- For public leaderboards
DROP POLICY IF EXISTS "Authenticated users can join challenges" ON public.challenge_participations;
CREATE POLICY "Authenticated users can join challenges" ON public.challenge_participations FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own participations" ON public.challenge_participations;
CREATE POLICY "Users can update own participations" ON public.challenge_participations FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenge_participations_updated_at BEFORE UPDATE ON public.challenge_participations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment event participants
CREATE OR REPLACE FUNCTION increment_event_participants(event_id_input uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET current_participants = current_participants + 1
  WHERE id = event_id_input;
END;
$$ LANGUAGE plpgsql;

-- Function to increment challenge participants
CREATE OR REPLACE FUNCTION increment_challenge_participants(challenge_id_input uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges
  SET current_participants = current_participants + 1
  WHERE id = challenge_id_input;
END;
$$ LANGUAGE plpgsql;










