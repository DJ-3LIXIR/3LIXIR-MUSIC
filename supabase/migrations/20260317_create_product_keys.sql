-- Product Keys table for plugin license verification
-- Keys are generated on successful purchase and verified by the 3LIXIR Loader app

CREATE TABLE IF NOT EXISTS product_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  plugin_id text NOT NULL,
  plugin_name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_value text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX idx_product_keys_user_id ON product_keys(user_id);
CREATE INDEX idx_product_keys_key_value ON product_keys(key_value);
CREATE INDEX idx_product_keys_order_id ON product_keys(order_id);
CREATE INDEX idx_product_keys_status ON product_keys(status);

-- RLS policies
ALTER TABLE product_keys ENABLE ROW LEVEL SECURITY;

-- Users can read their own product keys
CREATE POLICY "Users can view their own product keys"
  ON product_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update (via edge functions)
CREATE POLICY "Service role can manage product keys"
  ON product_keys
  FOR ALL
  USING (auth.role() = 'service_role');
