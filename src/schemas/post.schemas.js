import joi from "joi";

export const postSchema = joi.object({
  link: joi.string().uri().required(),
  postDescription: joi.string(),
});