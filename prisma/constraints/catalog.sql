-- Append to the generated catalog migration before applying it.
-- Kept separate while the Prisma engine download is blocked by network policy.
ALTER TABLE "Product" ADD CONSTRAINT "product_publish_verified" CHECK (
  "publication" <> 'PUBLISHED' OR
  ("verification" = 'VERIFIED' AND NOT "developmentOnly" AND "verifiedBy" IS NOT NULL AND "verifiedAt" IS NOT NULL)
);
ALTER TABLE "Product" ADD CONSTRAINT "development_product_unverified" CHECK (
  NOT "developmentOnly" OR ("verification" = 'UNVERIFIED' AND "publication" = 'DRAFT')
);
ALTER TABLE "Variant" ADD CONSTRAINT "variant_price_nonnegative" CHECK ("price" >= 0 AND ("oldPrice" IS NULL OR "oldPrice" >= "price"));
ALTER TABLE "Variant" ADD CONSTRAINT "variant_barcode_format" CHECK ("barcode" ~ '^[0-9]{13}$');
ALTER TABLE "InventoryBalance" ADD CONSTRAINT "inventory_nonnegative" CHECK ("onHand" >= 0 AND "reserved" >= 0 AND "reserved" <= "onHand");
ALTER TABLE "InventoryReservation" ADD CONSTRAINT "reservation_positive_quantity" CHECK ("quantity" > 0);
ALTER TABLE "SizeGuideRevision" ADD CONSTRAINT "guide_verification" CHECK (
  "verification" <> 'VERIFIED' OR (NOT "developmentOnly" AND "verifiedBy" IS NOT NULL AND "verifiedAt" IS NOT NULL)
);
CREATE FUNCTION reject_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Audit events are immutable'; END;
$$;
CREATE TRIGGER audit_immutable BEFORE UPDATE OR DELETE ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_audit_mutation();
