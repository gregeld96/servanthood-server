-- CreateEnum
CREATE TYPE "MaritalType" AS ENUM ('MARRIED', 'SINGLE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "first_timer" BOOLEAN NOT NULL DEFAULT true,
    "role_name" TEXT DEFAULT 'follower',
    "roleId" INTEGER NOT NULL DEFAULT 2,
    "department" TEXT,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "account_method" TEXT NOT NULL DEFAULT 'FORM',
    "phoneNumber" TEXT,
    "dob" TEXT,
    "marital" "MaritalType" DEFAULT 'SINGLE',
    "married_at" TIMESTAMP(3),
    "gender" TEXT,
    "parish_origin" TEXT,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "urban" TEXT,
    "zip_code" TEXT,
    "profile" TEXT,
    "membershipNumber" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_tokens" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "notification_id" TEXT,

    CONSTRAINT "account_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_notifications" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "message" TEXT,
    "title" TEXT,
    "redirect" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "account_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_partners" (
    "id" SERIAL NOT NULL,
    "husband_id" INTEGER,
    "wife_id" INTEGER,
    "husband_name" TEXT NOT NULL,
    "wife_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "account_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_kids" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "gender" TEXT,
    "profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "partner_kids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_settings" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "group" TEXT,
    "category" TEXT,
    "photo" TEXT,
    "first_value" TEXT,
    "second_value" TEXT,
    "third_value" TEXT,
    "fourth_value" TEXT,

    CONSTRAINT "master_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_of_values" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "first_value" TEXT NOT NULL,
    "second_value" TEXT,
    "third_value" TEXT,
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "list_of_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "horizontal_banner" TEXT,
    "vertical_banner" TEXT,
    "category" TEXT,
    "location" INTEGER,
    "location_name" TEXT,
    "location_address" TEXT,
    "start_date" TEXT,
    "start_end" TEXT,
    "end_date" TEXT,
    "end_time" TEXT,
    "open_regis" TEXT,
    "close_regis" TEXT,
    "form_format" TEXT,
    "form_link" TEXT,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "max_participant" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_in_charges" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_in_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_speakers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "title" TEXT,
    "origin" TEXT,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_form_registers" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER,
    "event_id" INTEGER NOT NULL,
    "participant_name" TEXT NOT NULL,
    "participant_dob" TEXT,
    "participant_gender" TEXT,
    "participant_parish_origin" TEXT,
    "attendance" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "events_form_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_kid_registers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "events_kid_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "pic_name" TEXT,
    "value_type" TEXT,
    "value" TEXT,
    "group" TEXT,
    "photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_medias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "other_value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT,
    "banner" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "project_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "banner" TEXT,
    "seo_title" TEXT NOT NULL,
    "seo_description" TEXT,
    "seo_keywords" TEXT,
    "author_id" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_internal" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "url_link" TEXT,
    "banner" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "title" TEXT,
    "origin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "address" TEXT,
    "link_map" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mimetype" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location_file" TEXT NOT NULL,
    "size" TEXT,
    "width" TEXT,
    "height" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "media_files_id_name_idx" ON "media_files"("id", "name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_tokens" ADD CONSTRAINT "account_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_notifications" ADD CONSTRAINT "account_notifications_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_fkey" FOREIGN KEY ("location") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_in_charges" ADD CONSTRAINT "events_in_charges_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_speakers" ADD CONSTRAINT "events_speakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_form_registers" ADD CONSTRAINT "events_form_registers_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_form_registers" ADD CONSTRAINT "events_form_registers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_kid_registers" ADD CONSTRAINT "events_kid_registers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_kid_registers" ADD CONSTRAINT "events_kid_registers_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "partner_kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
