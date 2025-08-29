import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value || "en";

  const messages = await import(`../../messages/${language}.json`);

  return {
    locale: language,
    messages: messages.default,
  };
});
