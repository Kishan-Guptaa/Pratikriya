import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { usersTable } from "./user";

export const fieldTypesEnum = pgEnum("field_type_enum", [
  "TEXT",
  "NUMBER",
  "EMAIL",
  "YES_NO",
  "PASSWORD",
  "PDF",
  "IMAGE",
  "MULTIPLE_IMAGES",
  "TEXTAREA",
  "PHONE",
  "DROPDOWN",
  "CHECKBOX",
  "RADIO",
  "DATE",
  "RATING",
  "SIGNATURE",
  "ADDRESS",
  "TERMS"
]);
export const formFieldsTable = pgTable("forms_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 100 }).notNull(),
  labelKey: varchar("label_key", { length: 100 }).notNull(),
  description: text("description"),
  placeholder: text("placeholder"),
  isRequired: boolean("is_required").default(false).notNull(),
  index: numeric("index", { scale: 2 }).notNull(),
  type: fieldTypesEnum("type").notNull(),
  formId: uuid("form_id").references(() => formsTable.id),
  configuration: text("configuration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => {
  return {
    uniqueFormIdAndIndex: unique("unique_form_id_index").on(table.formId, table.index)
  }
});