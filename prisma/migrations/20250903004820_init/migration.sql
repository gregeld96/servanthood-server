-- CreateEnum
CREATE TYPE "public"."MaritalType" AS ENUM ('MARRIED', 'SINGLE');

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "first_timer" BOOLEAN NOT NULL DEFAULT true,
    "is_jsoj" BOOLEAN NOT NULL DEFAULT false,
    "is_joined_whats_app" BOOLEAN NOT NULL DEFAULT false,
    "is_other_community" BOOLEAN NOT NULL DEFAULT false,
    "role_name" TEXT DEFAULT 'follower',
    "roleId" INTEGER NOT NULL DEFAULT 2,
    "department" TEXT,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "account_method" TEXT NOT NULL DEFAULT 'FORM',
    "phoneNumber" TEXT,
    "dob" TEXT,
    "marital" TEXT DEFAULT 'SINGLE',
    "married_at" TEXT,
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
CREATE TABLE "public"."social_media_account" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "username" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "social_media_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_tokens" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "notification_id" TEXT,

    CONSTRAINT "account_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_notifications" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "message" TEXT,
    "title" TEXT,
    "redirect" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "account_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_partners" (
    "id" SERIAL NOT NULL,
    "husband_id" INTEGER,
    "wife_id" INTEGER,
    "husband_name" TEXT,
    "wife_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "account_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partner_kids" (
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
CREATE TABLE "public"."master_settings" (
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
CREATE TABLE "public"."list_of_values" (
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
CREATE TABLE "public"."events" (
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
CREATE TABLE "public"."events_in_charges" (
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
CREATE TABLE "public"."events_speakers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "speaker_id" INTEGER,
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
CREATE TABLE "public"."events_form_registers" (
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
CREATE TABLE "public"."events_kid_registers" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "child_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "events_kid_registers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sections" (
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
CREATE TABLE "public"."project_medias" (
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
CREATE TABLE "public"."blogs" (
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
CREATE TABLE "public"."announcements" (
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
CREATE TABLE "public"."speakers" (
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
CREATE TABLE "public"."locations" (
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
CREATE TABLE "public"."media_files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mimetype" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location_file" TEXT NOT NULL,
    "size" TEXT,
    "width" TEXT,
    "height" TEXT,
    "userId" INTEGER NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "public"."accounts"("email");

-- CreateIndex
CREATE INDEX "accounts_email_id_publicId_idx" ON "public"."accounts"("email", "id", "publicId");

-- CreateIndex
CREATE INDEX "account_tokens_account_id_idx" ON "public"."account_tokens"("account_id");

-- CreateIndex
CREATE INDEX "account_notifications_account_id_idx" ON "public"."account_notifications"("account_id");

-- CreateIndex
CREATE INDEX "account_partners_husband_id_wife_id_idx" ON "public"."account_partners"("husband_id", "wife_id");

-- CreateIndex
CREATE INDEX "master_settings_category_group_id_idx" ON "public"."master_settings"("category", "group", "id");

-- CreateIndex
CREATE INDEX "list_of_values_id_name_idx" ON "public"."list_of_values"("id", "name");

-- CreateIndex
CREATE INDEX "events_id_publicId_slug_name_idx" ON "public"."events"("id", "publicId", "slug", "name");

-- CreateIndex
CREATE INDEX "events_form_registers_id_member_id_event_id_idx" ON "public"."events_form_registers"("id", "member_id", "event_id");

-- CreateIndex
CREATE INDEX "sections_id_category_idx" ON "public"."sections"("id", "category");

-- CreateIndex
CREATE INDEX "project_medias_id_category_name_idx" ON "public"."project_medias"("id", "category", "name");

-- CreateIndex
CREATE INDEX "announcements_id_name_category_idx" ON "public"."announcements"("id", "name", "category");

-- CreateIndex
CREATE INDEX "media_files_id_userId_name_idx" ON "public"."media_files"("id", "userId", "name");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_media_account" ADD CONSTRAINT "social_media_account_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account_tokens" ADD CONSTRAINT "account_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account_notifications" ADD CONSTRAINT "account_notifications_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_in_charges" ADD CONSTRAINT "events_in_charges_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_speakers" ADD CONSTRAINT "events_speakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_speakers" ADD CONSTRAINT "events_speakers_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_form_registers" ADD CONSTRAINT "events_form_registers_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_form_registers" ADD CONSTRAINT "events_form_registers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_kid_registers" ADD CONSTRAINT "events_kid_registers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events_kid_registers" ADD CONSTRAINT "events_kid_registers_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."partner_kids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media_files" ADD CONSTRAINT "media_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
