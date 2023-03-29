

CREATE TABLE IF NOT EXISTS components (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    sublabel TEXT,
    constructor_brand TEXT NOT NULL,
    priceMarket NUMERIC NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);