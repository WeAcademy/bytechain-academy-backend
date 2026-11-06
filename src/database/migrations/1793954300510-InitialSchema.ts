import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1793954300510 implements MigrationInterface {
  name = 'InitialSchema1793954300510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "username" character varying, "bio" text, "walletAddress" character varying, "avatarUrl" character varying, "role" character varying NOT NULL DEFAULT 'user', "suspended" boolean NOT NULL DEFAULT false, "onboardingCompleted" boolean NOT NULL DEFAULT false, "learningGoal" character varying, "lessonsCompleted" integer NOT NULL DEFAULT '0', "coursesCompleted" integer NOT NULL DEFAULT '0', "points" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', "streak" integer NOT NULL DEFAULT '0', "longestStreak" integer NOT NULL DEFAULT '0', "lastActiveAt" TIMESTAMP WITH TIME ZONE, "resetToken" character varying, "resetTokenExpires" TIMESTAMP WITH TIME ZONE, "failedLoginAttempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fc71cd6fb73f95244b23e2ef113" UNIQUE ("walletAddress"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "webhooks" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "url" character varying NOT NULL, "secret" character varying NOT NULL, "events" text NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e8795cfc899ab7bdaa831e8527" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "badges" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "key" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "xpThreshold" integer NOT NULL, "iconUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_48f63aae4227e0bc83aaee6428" ON "badges" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_badges" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "badgeId" uuid NOT NULL, "awardedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76e9ac35f4d56715c688a345fe6" UNIQUE ("userId", "badgeId"), CONSTRAINT "PK_0ca139216824d745a930065706a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reward_history" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "amount" integer NOT NULL, "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1790d3b4570b3f09a5d486b8193" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "text" text NOT NULL, "type" character varying NOT NULL DEFAULT 'multiple_choice', "options" text NOT NULL, "correctAnswer" character varying NOT NULL, "quizId" uuid NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_registrations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "courseId" uuid NOT NULL, "enrolledAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_348b8c48312b1ac40fdbe841591" UNIQUE ("userId", "courseId"), CONSTRAINT "PK_a8726b4f90ee73642e768e21ef0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "description" text NOT NULL, "published" boolean NOT NULL DEFAULT false, "difficulty" character varying, "tags" text NOT NULL DEFAULT '[]', "thumbnailUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "content" text NOT NULL, "published" boolean NOT NULL DEFAULT true, "videoUrl" character varying, "videoStartTimestamp" integer, "order" integer NOT NULL DEFAULT '0', "courseId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "description" text, "maxAttempts" integer NOT NULL DEFAULT '1', "lessonId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_eba9ff0775c843581aab6916b3" UNIQUE ("lessonId"), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_submissions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "quizId" uuid NOT NULL, "attemptNumber" integer NOT NULL DEFAULT '1', "answers" text NOT NULL, "score" numeric(5,2) NOT NULL, "totalQuestions" integer NOT NULL, "correctAnswers" integer NOT NULL, "passed" boolean NOT NULL DEFAULT false, "submittedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3fd96789b070c28b7aeeb2c32c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "progress" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "courseId" uuid NOT NULL, "lessonId" uuid NOT NULL, "completed" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_26319ff74c8120c7b08842013f7" UNIQUE ("userId", "lessonId"), CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "type" character varying NOT NULL, "message" text NOT NULL, "link" character varying, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dao_proposals" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "description" text NOT NULL, "proposerId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "votingDeadline" TIMESTAMP WITH TIME ZONE NOT NULL, "yesVotes" integer NOT NULL DEFAULT '0', "noVotes" integer NOT NULL DEFAULT '0', "abstainVotes" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "moderationReason" text, "moderatedAt" TIMESTAMP WITH TIME ZONE, "moderatorId" uuid, CONSTRAINT "PK_6d4a062b80be612fd84b32e6e51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dao_votes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "proposalId" uuid NOT NULL, "voterId" uuid NOT NULL, "vote" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5eef691b12358e4886063e3350a" UNIQUE ("proposalId", "voterId"), CONSTRAINT "PK_f01f5d9b08b39bcb01a30968ba1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."currency_entries_type_enum" AS ENUM('CRYPTO', 'FIAT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency_entries" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "symbol" character varying NOT NULL, "type" "public"."currency_entries_type_enum" NOT NULL DEFAULT 'CRYPTO', "description" text NOT NULL, "logoUrl" character varying, "historicalData" text, "launchYear" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_75935065722434c2fd077d11902" UNIQUE ("name"), CONSTRAINT "UQ_03cb2aa7b142a6537318bc4d5b5" UNIQUE ("symbol"), CONSTRAINT "PK_74e99115d118b0574e2ce1db883" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "certificates" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "certificateHash" character varying NOT NULL, "recipientName" character varying, "recipientEmail" character varying NOT NULL, "courseOrProgram" character varying NOT NULL, "certificateData" text NOT NULL, "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE, "isValid" boolean NOT NULL DEFAULT true, "certificatePath" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "courseId" uuid, CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9f54c64a8a7af8ad56f5065b2a" ON "certificates" ("certificateHash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "hashedToken" character varying NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhooks" ADD CONSTRAINT "FK_7dbbb3fa9d7ccab4925a67af414" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" ADD CONSTRAINT "FK_7043fd1cb64ec3f5ebdb878966c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" ADD CONSTRAINT "FK_bd34ef334baea6f589a53438a1e" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward_history" ADD CONSTRAINT "FK_c8c51bce1a96ca7af60664a6953" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_registrations" ADD CONSTRAINT "FK_bf1afb5a5857b9810ad3ea71c84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_registrations" ADD CONSTRAINT "FK_0ea8e25d3c78b9dc020ee66f0d8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_eba9ff0775c843581aab6916b32" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" ADD CONSTRAINT "FK_a8dc82e96f467a4e41f3136acd4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" ADD CONSTRAINT "FK_bd0f442d9679d0cd390e28ec1ab" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_cb4d1477194c4ba8cf55bb6eb4b" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" ADD CONSTRAINT "FK_df6c728a3df388df34e03d08088" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_proposals" ADD CONSTRAINT "FK_12d32e778d6ab90368516b2fe4c" FOREIGN KEY ("proposerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_proposals" ADD CONSTRAINT "FK_ff08de0f16c3f30acd7d18d13a7" FOREIGN KEY ("moderatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_votes" ADD CONSTRAINT "FK_cbc183a0d34110a59e0dc113fa1" FOREIGN KEY ("proposalId") REFERENCES "dao_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_votes" ADD CONSTRAINT "FK_9966c157445ecafabc8ae3c6c3d" FOREIGN KEY ("voterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ADD CONSTRAINT "FK_7d072194aef1ecb98664c83e861" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" ADD CONSTRAINT "FK_e50e73bc3bdcfb0eb3d561f1494" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" DROP CONSTRAINT "FK_e50e73bc3bdcfb0eb3d561f1494"`,
    );
    await queryRunner.query(
      `ALTER TABLE "certificates" DROP CONSTRAINT "FK_7d072194aef1ecb98664c83e861"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_votes" DROP CONSTRAINT "FK_9966c157445ecafabc8ae3c6c3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_votes" DROP CONSTRAINT "FK_cbc183a0d34110a59e0dc113fa1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_proposals" DROP CONSTRAINT "FK_ff08de0f16c3f30acd7d18d13a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dao_proposals" DROP CONSTRAINT "FK_12d32e778d6ab90368516b2fe4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_df6c728a3df388df34e03d08088"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_cb4d1477194c4ba8cf55bb6eb4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" DROP CONSTRAINT "FK_bd0f442d9679d0cd390e28ec1ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" DROP CONSTRAINT "FK_a8dc82e96f467a4e41f3136acd4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_eba9ff0775c843581aab6916b32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_registrations" DROP CONSTRAINT "FK_0ea8e25d3c78b9dc020ee66f0d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_registrations" DROP CONSTRAINT "FK_bf1afb5a5857b9810ad3ea71c84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward_history" DROP CONSTRAINT "FK_c8c51bce1a96ca7af60664a6953"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" DROP CONSTRAINT "FK_bd34ef334baea6f589a53438a1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" DROP CONSTRAINT "FK_7043fd1cb64ec3f5ebdb878966c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhooks" DROP CONSTRAINT "FK_7dbbb3fa9d7ccab4925a67af414"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f54c64a8a7af8ad56f5065b2a"`,
    );
    await queryRunner.query(`DROP TABLE "certificates"`);
    await queryRunner.query(`DROP TABLE "currency_entries"`);
    await queryRunner.query(`DROP TYPE "public"."currency_entries_type_enum"`);
    await queryRunner.query(`DROP TABLE "dao_votes"`);
    await queryRunner.query(`DROP TABLE "dao_proposals"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "progress"`);
    await queryRunner.query(`DROP TABLE "quiz_submissions"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "course_registrations"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "reward_history"`);
    await queryRunner.query(`DROP TABLE "user_badges"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_48f63aae4227e0bc83aaee6428"`,
    );
    await queryRunner.query(`DROP TABLE "badges"`);
    await queryRunner.query(`DROP TABLE "webhooks"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
