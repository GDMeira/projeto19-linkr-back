CREATE TABLE "likes"(
    "id" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL
);
ALTER TABLE
    "likes" ADD PRIMARY KEY("id");
CREATE TABLE "posts_hashtags"(
    "id" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,
    "hashtagName" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "posts_hashtags" ADD PRIMARY KEY("id");
CREATE TABLE "sessions"(
    "id" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "token" VARCHAR(36) NOT NULL
);
ALTER TABLE
    "sessions" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "userName" VARCHAR(255) NOT NULL,
    "pictureUrl" TEXT NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
ALTER TABLE
    "users" ADD CONSTRAINT "users_username_unique" UNIQUE("userName");
CREATE TABLE "posts"(
    "id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "postDescription" VARCHAR(511) NOT NULL,
    "linkTitle" TEXT NOT NULL,
    "linkDescription" TEXT NOT NULL,
    "linkImage" TEXT NOT NULL
);
ALTER TABLE
    "posts" ADD PRIMARY KEY("id");
CREATE TABLE "hashtags"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "count" BIGINT NOT NULL DEFAULT '1'
);
ALTER TABLE
    "hashtags" ADD PRIMARY KEY("id");
ALTER TABLE
    "hashtags" ADD CONSTRAINT "hashtags_name_unique" UNIQUE("name");
ALTER TABLE
    "likes" ADD CONSTRAINT "likes_userid_foreign" FOREIGN KEY("userId") REFERENCES "users"("id");
ALTER TABLE
    "posts_hashtags" ADD CONSTRAINT "posts_hashtags_hashtagname_foreign" FOREIGN KEY("hashtagName") REFERENCES "hashtags"("name");
ALTER TABLE
    "posts_hashtags" ADD CONSTRAINT "posts_hashtags_postid_foreign" FOREIGN KEY("postId") REFERENCES "posts"("id");
ALTER TABLE
    "sessions" ADD CONSTRAINT "sessions_userid_foreign" FOREIGN KEY("userId") REFERENCES "users"("id");
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_userid_foreign" FOREIGN KEY("userId") REFERENCES "users"("id");
ALTER TABLE
    "likes" ADD CONSTRAINT "likes_postid_foreign" FOREIGN KEY("postId") REFERENCES "posts"("id");