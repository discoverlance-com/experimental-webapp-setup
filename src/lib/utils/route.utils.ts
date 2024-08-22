import vine from "@vinejs/vine";

export const todoIdRequestParamSchema = vine.object({
  id: vine.string().uuid(),
});
